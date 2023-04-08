import { Request, Response } from "express";
import prisma from "../../middleware/prisma";
import { notes, users } from "@prisma/client";

class UserController
{
    public profile: (req: Request, res: Response) => Promise<any> = async (req, res) => {
        try {
            const { id } = res.locals.user;
            if (id) {
                const user: users = await prisma.users.findUnique({
                    where: {
                        id,
                    },
                });
                if (user) {
                    const { id, password, createdAt, ...others } = user;
                    res.json({
                        success: true,
                        message: "Profile found",
                        user: others,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Profile not found",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Please log in again",
                });
            }
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    public notes: (req: Request, res: Response) => Promise<any> = async (req, res) => {
        try {
            const { id } = res.locals.user;
            if (id) {
                const notes: notes[] = await prisma.notes.findMany({
                    where: {
                        user: {
                            id,
                        }
                    },
                });
                if (notes) {
                    res.json({
                        success: true,
                        message: "Notes found",
                        notes,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Notes not found",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Please log in again",
                });
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default UserController;