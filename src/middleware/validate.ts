import { Request, Response, NextFunction } from "express"
import { verify, VerifyErrors } from "jsonwebtoken"
import prisma from "./prisma"

const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string = req.headers.authorization?.split(" ")[1]
    let jwtSecret: string = process.env.JWT_AUTH_SECRET!
    if (token) {
        verify(token, jwtSecret, (err: VerifyErrors, decoded: any) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid token"
                })
            } else {
                res.locals.user = decoded.payload
                next()
            }
        })
    } else {
        res.json({
            success: false,
            message: "Please provide token"
        })
    }
}

const validateNotes = async (req: Request, res: Response, next: NextFunction) => {
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
            message: "Error finding Doc",
            error: "Doc not found"
        });
    }
}

export { validateUser, validateNotes };