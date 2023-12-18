import { Router } from "express";
import UserController from '../controllers/user.js';
import { checkIsAdmin } from "../middlewares/roles.js";

const router = Router();

// admin
router.post("/premium/:userId", checkIsAdmin, UserController.userUpgradeToPremium); 

export {router};