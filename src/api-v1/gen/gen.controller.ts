import { Request, Response } from 'express';
import createPdf from '../../middleware/pdfkit';

class GenController
{
    public generatepdf: (req: Request, res: Response) => any = async (req, res) => {
        const { content } = req.body;
        const id = res.locals.id;
        try{
            const pdf = await createPdf(content);
            res.status(200).json({
                message: "PDF Generated",
                data: {
                    pdf: pdf
                }
            });
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