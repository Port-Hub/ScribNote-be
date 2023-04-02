import { Request, Response } from "express";
import prisma from "../../middleware/prisma";

class UserController
{
    public profile = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = res.locals.user;
            if (id) {
                const user = await prisma.users.findUnique({
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
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default UserController;