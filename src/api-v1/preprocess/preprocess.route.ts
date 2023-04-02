import * as path from "path";
import * as multer from "multer";
import * as e from "express";
import AnalyseController from "./analyse.controller";
import SummarizeController from "./summarize.controller";

const preprocess: e.Router = e.Router();
const analyseController = new AnalyseController();
const summarizeController = new SummarizeController();

const storage: any = multer.diskStorage({
    destination: "./public/audio/",
    filename: (req: e.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
       cb(null,"VOICE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const upload: e.RequestHandler = multer({
    storage: storage,
    limits:{fileSize: 100000000},
 }).single("myVoice");

preprocess.post("/analyse",upload,analyseController.callbackFunction);
preprocess.post("/summarize",summarizeController.callbackFunction);

export default preprocess;