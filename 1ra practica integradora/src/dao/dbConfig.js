import mongoose from "mongoose"

const URI="mongodb+srv://JMMartinez68:mily060601@cluster0.kcahmxv.mongodb.net/ecommerce?retryWrites=true&w=majority"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada....")

