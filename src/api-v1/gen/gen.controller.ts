import { Request, Response } from 'express';
import createPdf from '../../middleware/pdfkit';

class GenController
{
    public generatepdf: (req: Request, res: Response) => any = async (req, res) => {
        const { content } = req.body;
        const doc = res.locals.doc;
        try{
            const pdf = createPdf(content);
            console.log(pdf);
            res.status(200).json({
                message: "PDF Generated",
                data: {
                    doc
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