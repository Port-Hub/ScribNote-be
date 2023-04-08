import { Request, Response } from "express"
import prisma from "../../middleware/prisma";

class AccessController
{
    public access: (req: Request, res: Response) => Promise<any> = async (req, res) =>
    {
        try
        {
            const doc = res.locals.doc;
            const user = res.locals.user;
            if(doc)
            {
                if(user.wallet >= doc.credits)
                {
                    const updateUser = await prisma.users.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            wallet: {
                                decrement: doc.credits
                            }
                        }
                    });

                    const updateDoc = await prisma.notes.update({
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
                        res.status(200).download(doc.docLoc, doc.name, (err) => {
                            if (err)
                            {
                                res.status(500).json(err);
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
        }
        catch (err)
        {
            res.status(500).json(err.message);
        }
    }
}

export default AccessController;