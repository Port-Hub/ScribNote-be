import { Router } from "express";
import AnalyseController from "./analyse.controller";

const analyse: Router = Router();
const analyseController = new AnalyseController();

analyse.post("/",analyseController.analyse);

export default analyse;