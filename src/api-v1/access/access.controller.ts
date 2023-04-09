import { Request, Response } from "express"
import prisma from "../../middleware/prisma";
import { notes, users } from ".prisma/client";

class AccessController
{
    public access: (req: Request, res: Response) => Promise<any> = async (req, res) =>
    {
        try
        {
            const doc: any = res.locals.doc;
            const user: any = res.locals.user;
            if(user.wallet >= doc.credits)
            {
                const updateUser: users = await prisma.users.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        wallet: {
                            decrement: doc.credits
                        }
                    }
                });

                const updateDoc: notes = await prisma.notes.update({
                    where: {
                        id: doc.id,
                    },
                    data: {
                        accessCount: {
                            increment: 1
                        }
                    }
                });

                if(updateDoc && updateUser)
                {
                    res.status(200).download(doc.docLoc, doc.name, async (err: any) => {
                        if (err)
                        {
                            res.status(500).json({
                                error: await err.message,
                                message: "Try regenerating notes"
                            });
                        }
                    });
                }
                else
                {
                    res.status(500).json({ message: "Error updating document" });
                }
            }
            else
            {
                res.status(400).json({ message: "Insufficient credits" });
            }
        }
        catch (err: any)
        {
            res.status(500).json(await err.message);
        }
    }
}

export default AccessController;