import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import {connectDB} from "./config/configServer.js"
import { __dirname } from "./utils.js"

import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';
//socketservers
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';
import  viewsRouter  from "./routers/views.router.js";
import { sessionsRouter } from "./routers/sessions.routes.js";
import { config } from "./config/config.js";
import session from "express-session";
import MongoStore from "connect-mongo";


const app = express();
const PORT = process.env.PORT || 8080
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views")

app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/', routerV);

connectDB()

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/api/products`)
        console.log(`\t2). http://localhost:${PORT}/api/carts`);
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)


//configuracion de sesiones
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

//routes
app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);