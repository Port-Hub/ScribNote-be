import { Request, Response, NextFunction } from "express"
import { verify, VerifyErrors } from "jsonwebtoken"
import prisma from "./prisma"
import { notes } from ".prisma/client"

const validateUser: (req: any, res: any, next: any) => Promise<void> = async (req, res, next) => {
    try {
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
    } catch (err: any) {
        res.status(500).json({
            message: "Error validating user",
            error: await err.message
        })
    }
}

const validateNotes: (req: Request, res: Response, next: NextFunction) => Promise<any> = async (req, res, next) => {
    try {
        const slug: string = req.params.slug;
        const user: any = res.locals.user;
        const doc: notes = await prisma.notes.findFirst({
            where: {
                nameSlug: slug,
                user: {
                    id: user.id
                }
            },
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
    } catch (err: any) {
        res.status(500).json({
            message: "Error validating notes",
            error: await err.message
        })
    }
}

export { validateUser, validateNotes };