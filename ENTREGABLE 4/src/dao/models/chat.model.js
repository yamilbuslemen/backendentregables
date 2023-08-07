import mongoose from "mongoose";

const chatCollection = "chatMessages";

const messageSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

});

[
    {user:"user@gmail.com", message:"hola"},
    {user:"user2@gmail.com", message:"hola2"}
]

export const chatModel = mongoose.model