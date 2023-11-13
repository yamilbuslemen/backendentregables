import express from 'express';
import { config } from "./config/config.js";
import { engine } from 'express-handlebars';
import path from "path";
import { __dirname } from "./utils.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";
import { viewsRouter }   from "./routes/views.router.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
//import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import {connectDB} from "./config/configServer.js"
//socketservers
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';
import { chatModel } from "./dao/models/chat.model.js";

import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generateUser } from './utils/helpers.js'; 
import { addLogger } from "./helpers/logger.js";

import { usersRouter } from "./routes/users.routes.js";
import { swaggerSpecs } from './config/swagger.config.js';
import swaggerUI from "swagger-ui-express";


const PORT = config.server.port;
const app = express();
const logger = addLogger();

//middlewares
app.use(express.json()); // json en el body de una petición
app.use(express.urlencoded({ extended: true })); // json si la petición viene de un formulario
app.use(express.static(__dirname + "/public"));
//servidor de express
const httpServer = app.listen(PORT, () => {
    try {
        logger.info("Server ok")
        //console.log(`Listening to the port ${PORT}\n`);
    }
    catch (err) {
        logger.info("Server error", err)
        //console.log(err);
    }
});

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//configuracion de sesiones
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

//servidor de websocket
const io = new Server(httpServer);
//socket server
io.on("connection",(socket)=>{
    console.log("nuevo cliente conectado");

    socket.on("authenticated",async(msg)=>{
        const messages = await chatModel.find();
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser", msg);
    });

    //recibir el mensaje del cliente
    socket.on("message",async(data)=>{
        console.log("data", data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        //cada vez que recibamos este mensaje, enviamos todos los mensajes actualizados a todos los clientes conectados
        io.emit("messageHistory", messages);
    })
});

// Facker
app.get("/api/users", (req,res)=>{
    const cant = parseInt(req.query.cant) || 100;
    let users = [];
    for(let i=0;i<cant;i++){
        const user = generateUser();
        users.push(user);
    }
    res.json({status:"success", data:users});
});


// Logger
app.get("/operacionSencilla",(req,res)=>{
    let sum=0;
    for(let i=0;i<1000;i++){
        sum+=i;
    }
    res.send(`La suma es igual a ${sum}`);
});

app.get("/operacionCompleja",(req,res)=>{
    let sum=0;
    for(let i=0;i<5e7;i++){//50.000.000
        sum+=i;
    }
    res.send(`La suma es igual a ${sum}`);
});

//endpoint para acceder a la documentacion de la api
app.use("/api/docs",swaggerUI.serve,swaggerUI.setup(swaggerSpecs));

export {app}