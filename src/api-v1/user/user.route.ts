import { Router } from "express";
import UserController from "./user.controller";


const user: Router = Router();
const userController: UserController = new UserController();

user.get("/", userController.profile);
user.get("/notes", userController.notes);
user.post("/update/email", userController.updateEmail);
user.post("/update/password", userController.updatePassword);

export default user;