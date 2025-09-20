import express from "express";
import { getAllUsers } from "../controller/user.controller.js"; 

const UserRouter = express.Router();

UserRouter.get("/", getAllUsers);

export default UserRouter;
