import { Request, Response, NextFunction } from "express";
import prisma from "./prisma";

const findID = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const id = await prisma.notes.findUnique({
        where: {
            name: name
        }
    });
    if(id)
    {
        res.locals.id = id;
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