import { Request, Response } from "express";
import prisma from "../../middleware/prisma";
import { notes, users } from "@prisma/client";
import { hash } from "bcryptjs";

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
                        userId: id,
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

    public updateEmail: (req: Request, res: Response) => Promise<any> = async (req, res) => {
        try {
            const { id } = res.locals.user;
            const { email } = req.body;
            if (id) {
                const user: users = await prisma.users.update({
                    where: {
                        id,
                    },
                    data: {
                        email,
                    },
                });
                if (user) {
                    const { id, password, createdAt, ...others } = user;
                    res.json({
                        success: true,
                        message: "Email updated",
                        user: others,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Email not updated",
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

    public updatePassword: (req: Request, res: Response) => Promise<any> = async (req, res) => {
        try {
            const { id } = res.locals.user;
            const { password } = req.body;
            let hashedPassword: string = await hash(password, 10);
            if (id) {
                const user: users = await prisma.users.update({
                    where: {
                        id,
                    },
                    data: {
                        password: hashedPassword,
                    },
                });
                if (user) {
                    const { id, password, createdAt, ...others } = user;
                    res.json({
                        success: true,
                        message: "Password updated",
                        user: others,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Password not updated",
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