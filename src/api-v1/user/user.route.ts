import { Router } from "express";
import UserController from "./user.controller";


const user: Router = Router();
const userController: UserController = new UserController();

user.get("/", userController.profile);
user.get("/notes", userController.notes);

export default user;