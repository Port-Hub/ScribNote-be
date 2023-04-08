import { Router } from "express";
import UpdateController from "./update.controller";

const update: Router = Router();
const updateController: UpdateController = new UpdateController();

update.post("/email", updateController.updateEmail);
update.post("/password", updateController.updatePassword);
update.post("/wallet", updateController.updateWallet);

export default update;