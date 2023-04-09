import * as path from "path";
import * as multer from "multer";
import { Request, Response , RequestHandler } from "express";
import prisma from "../../middleware/prisma";
import { notes } from ".prisma/client";

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
                    error: await err
                });
            }
            else{
                try
                {
                    const name: string = req.body.name;
                    const nameSlug: string = name.replace(/\s+/g, "-").toLowerCase();
                    const nameExists: notes = await prisma.notes.findFirst({
                        where: {
                            name: name
                        }
                    });
                    const slugExists: notes = await prisma.notes.findFirst({
                        where: {
                            nameSlug: nameSlug
                        }
                    });
                    if(nameExists || slugExists)
                    {
                        res.status(400).json({
                            message: "Name already exists"
                        });
                    }
                    else
                    {
                        const fileAdded: notes = await prisma.notes.create({
                            data: {
                                name: name,
                                nameSlug: nameSlug,
                                docLoc: "Empty",
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
                                error: await err.message
                            });
                        }
                    }
                }
                catch(err: any)
                {
                    console.log(err);
                    res.status(400).json({
                        message: "Error uploading file",
                        error: await err.message
                    });
                }
            }
        });
     }
}

export default UploadController;