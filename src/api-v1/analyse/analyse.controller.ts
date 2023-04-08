import axios, { AxiosResponse } from "axios";
import cohere = require("cohere-ai");
import { cohereResponse, summarizeResponse } from "cohere-ai/dist/models";
import { Request, Response } from "express";
import { readFileSync } from "fs";

class AnalyseController {
    public analyse = async (req: Request, res: Response) => {
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
                this.summarize(result).then((response: any) => {
                    if(response.code !== 200)
                    {
                        console.log("Summarize Function : "+response.message);
                        res.status(response.code).json({
                            message: response.message
                        });
                    }
                    else
                    {
                        res.status(response.code).json({
                            message: response.message
                        });
                    }
                });
            }
        }
        catch(err: any) {
            console.log("Analyse Function : "+err);
            res.status(500).json({
                message: err
            });
        }
    }

    public summarize: (result: any) => Promise<{ message: any; code: number }> = async (result) => {
        try {
            const coherekey: string = process.env.COHERE_API_KEY!
            cohere.init(coherekey);
            const response: cohereResponse<summarizeResponse> = await cohere.summarize({
                text: result.text,
                length: 'medium',
                format: 'bullets',
                model: 'summarize-xlarge',
                temperature: 0.3,
            });
            const content: cohereResponse<summarizeResponse> = await response;
            if(content)
            {
                return { message: content, code: 200 };
            }
            else
            {
                return { message: "Internal Error", code: 500 };
            }
        }
        catch(err: any) {
            console.log("Summarize Function : "+err);
            return { message: err.message, code: 500 };
        }
    }

}

export default AnalyseController;