import { Router } from "express";
import AccessController from "./access.controller";

const access: Router = Router();
const accessController: AccessController = new AccessController();

access.get("/:slug", accessController.access);

export default access;