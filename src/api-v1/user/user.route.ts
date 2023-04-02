import { Router } from "express";
import UserController from "./user.controller";


const user: Router = Router();
const userController = new UserController();

user.get("/profile", userController.profile);
user.get("/notes", userController.notes);

export default user;