import { users } from "@prisma/client";
import { hash } from "bcryptjs";
import prisma from "../../middleware/prisma";
import { Request, Response } from "express";

class UpdateController {
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
    public updateWallet: (req: Request, res: Response) => Promise<any> = async (req, res) => {
        try {
            const { id, wallet } = res.locals.user;
            if (id && wallet <= 10) {
                const user: users = await prisma.users.update({
                    where: {
                        id,
                    },
                    data: {
                        wallet: {
                            increment: 10
                        }
                    },
                });
                if (user) {
                    const { id, password, createdAt, ...others } = user;
                    res.json({
                        success: true,
                        message: "Wallet updated",
                        user: others,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Wallet not updated",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Cannot provide credits",
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

export default UpdateController;