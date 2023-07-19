import { Router } from "express";


const router = Router();


//routes
router.get("/home", (req,res)=>{
    
    //indicar la vista
    res.render("home");
});
router.get("/realtime",(req,res)=>{
    //indicar la vista
    res.render("realtime");
});


export {router as viewsRouter};