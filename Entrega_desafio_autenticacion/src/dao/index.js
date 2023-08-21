import { ProductManagerMongo } from "./managers/productManagerMongo.js";
import { CartManagerMongo } from "./managers/cartManagerMongo.js";
import { connectDB } from "../config/configServer.js";
import { UsersMongo } from "./managers/users.mongo.js";

//persistencia de mongoDB
connectDB();
const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();
const usersService = new UsersMongo();

export {productService, cartService, usersService}