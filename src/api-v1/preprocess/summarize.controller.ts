import * as cohere from "cohere-ai";
import { cohereResponse, summarizeResponse } from "cohere-ai/dist/models";
import { Request, Response } from "express";

interface Summary
{
    params: string;
    callback: { (results: any): void; (arg0: { message: any; code: number; }): any; };
}

export default class SummarizeController {
    public summarizeFunction: (params: Summary["params"], callback: Summary["callback"]) => Promise<any> = async (params, callback) => {
        try {
            const coherekey: string = process.env.COHERE_API_KEY!
            cohere.init(coherekey);
            const query: (paragraph: string) => Promise<void | cohereResponse<summarizeResponse>> = async (paragraph) => {
                try{
                    const response: cohereResponse<summarizeResponse> = await cohere.summarize({ 
                        text: paragraph,
                        length: 'medium',
                        format: 'bullets',
                        model: 'summarize-xlarge',
                        temperature: 0.3,
                    }); 
                    const result: cohereResponse<summarizeResponse> = await response;;
                    return result;
                    } catch (err: any) {
                        console.log("Summarize function : "+err);
                        return callback({ message: err, code: 500 });
                    }
            }
            await query(params).then((response) => {
                return callback({ message: response, code: 200 });
            });
        } 
        catch (err: any) {
            console.log(err);
            return callback({ message: err, code: 500 });
        }
    }

    public callbackFunction: (req: Request, res: Response) => Promise<void> = async (req, res) => {
        const params: any = req.body;
        await this.summarizeFunction(params.paragraph, (results: any) => {
            if (!results) {
                console.log("Error");
                res.status(500).send("Internal Error");
            } else {
                res.status(results.code).send(results.message);
            }
        });
    };

}