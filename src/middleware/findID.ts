import { Request, Response, NextFunction } from "express";
import prisma from "./prisma";

const findID = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const doc = await prisma.notes.findUnique({
        where: {
            name: name
        }
    });
    if(doc)
    {
        res.locals.doc = doc;
        next();
    }
    else{
        res.status(400).json({
            message: "Error finding ID",
            error: "ID not found"
        });
    }
}

export default findID;