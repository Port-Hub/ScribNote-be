import * as path from "path";
import * as multer from "multer";
import { Request, Response , RequestHandler } from "express";
import prisma from "../../middleware/prisma";

class UploadController {

    storage: any = multer.diskStorage({
        destination: "./public/audio/",
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
           cb(null,"Voice-" + Date.now() + path.extname(file.originalname));
        }
     });
    
     uploader: RequestHandler = multer({
        storage: this.storage,
        limits:{fileSize: 100000000},
     }).single("myVoice");

     uploadHandler: (req: Request, res: Response) => any = async (req, res) => {
        this.uploader(req, res, async (err: any) => {
            if(err){
                res.status(400).json({
                    message: "Error uploading file",
                    error: err
                });
            }
            else{
                try
                {
                    const name = req.body.name;
                    const nameSlug = name.replace(/\s+/g, "-").toLowerCase();
                    const fileAdded = await prisma.notes.create({
                        data: {
                            name: name,
                            nameSlug: nameSlug,
                            docLoc: "Empty",
                            // userId: res.locals.user.id,
                            audioLoc: req.file.path,
                            user: {
                                connect: {
                                    id: res.locals.user.id
                                }
                            }
                        }});
                    if(fileAdded)
                    {
                        res.status(200).json({
                            message: "File is uploaded",
                            data: {
                                file: req.file
                            }
                        });
                    }
                    else{
                        res.status(400).json({
                            message: "Error uploading file",
                            error: err.message
                        });
                    }
                }
                catch(err: any)
                {
                    console.log(err);
                    res.status(400).json({
                        message: "Error uploading file",
                        error: err.message
                    });
                }
            }
        });
     }
}

export default UploadController;