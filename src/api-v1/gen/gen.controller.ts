import { Request, Response } from 'express';
import createPdf from '../../middleware/pdfkit';
import prisma from '../../middleware/prisma';

class GenController
{
    public generatepdf: (req: Request, res: Response) => any = async (req, res) => {
        const { content } = req.body;
        const doc = res.locals.doc;
        try{
            const pdfpath = createPdf(content);
            if(pdfpath)
            {
                const updatedoc = await prisma.notes.update({
                    where: {
                        id: doc.id
                    },
                    data: {
                        docLoc: pdfpath
                    }
                });
                if(updatedoc)
                {
                    res.status(200).json({
                        message: "PDF generated",
                        data: {
                            doc: updatedoc
                        }
                    });
                }
                else{
                    res.status(400).json({
                        message: "Error generating PDF",
                        error: "Error updating doc"
                    });
                }
            }
        }
        catch(err){
            res.status(500).json({
                message: "Error generating PDF",
                data: {
                    error: err.message
                }
            });
        }

    }
}

export default GenController;