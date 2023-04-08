import { Router } from "express";
import GenController from "./gen.controller";

const gen: Router = Router();
const genController: GenController = new GenController();

gen.post("/",genController.analyse,genController.summarize, genController.generate);

export default gen;