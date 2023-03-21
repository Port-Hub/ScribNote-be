import { Router } from "express";
import SummarizeController from "./summarize.controller";

const summarize: Router = Router();
const summarizeController = new SummarizeController();

summarize.post("/", summarizeController.callbackFunction);

export default summarize;