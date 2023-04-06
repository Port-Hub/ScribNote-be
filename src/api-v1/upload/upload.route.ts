import { Router } from "express";
import UploadController from "./upload.controller";


const upload: Router = Router();
const uploadController: UploadController = new UploadController();

upload.post("/",uploadController.uploadHandler);

export default upload;