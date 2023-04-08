import { NextFunction, Request, Response } from 'express';
import axios, { AxiosResponse } from "axios";
import cohere = require("cohere-ai");
import { cohereResponse, summarizeResponse } from "cohere-ai/dist/models";
import { readFileSync } from "fs";
import createPdf from '../../middleware/pdfkit';
import prisma from '../../middleware/prisma';

class GenController
{
    public analyse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { audioLoc, ...others } = res.locals.doc;
            const data: Buffer = readFileSync(audioLoc);
            const response: AxiosResponse<any,any> = await axios.post(
                "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
                data,
                {
                    headers: { Authorization: "Bearer "+process.env.HF_API_KEY }
                }
            );
            const result: any = await response.data;
            if(response.status !== 200)
            {
                console.log("Analyse Function : "+result);
                res.status(response.status).json({
                    message: result
                });
            }
            else
            {
                res.locals.result = result;
                next();
            }
        }
        catch(err: any) {
            console.log("Analyse Function : "+err);
            res.status(500).json({
                message: err
            });
        }
    }

    public summarize: (req: Request, res: Response, next: NextFunction) => Promise<any> = async (req,res,next) => {
        try {
            const coherekey: string = process.env.COHERE_API_KEY!
            cohere.init(coherekey);
            const result = res.locals.result;
            const response: cohereResponse<summarizeResponse> = await cohere.summarize({
                text: result.text,
                length: 'medium',
                format: 'bullets',
                model: 'summarize-xlarge',
                temperature: 0.3,
            });
            const output: cohereResponse<summarizeResponse> = await response;
            if(output)
            {
                res.locals.content = output.body.summary;
                next();
            }
            else
            {
                res.status(500).json({ message: "Internal Error" });
            }
        }
        catch(err: any) {
            console.log("Summarize Function : "+err);
            return res.status(500).json({ message: err.message });
        }
    }

    public generate: (req: Request, res: Response) => any = async (req, res) => {
        const content = res.locals.content;
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