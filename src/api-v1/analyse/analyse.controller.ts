import axios, { AxiosResponse } from "axios";
import cohere = require("cohere-ai");
import { cohereResponse, summarizeResponse } from "cohere-ai/dist/models";
import { Request, Response } from "express";
import { readFileSync } from "fs";


interface Summary
{
    params: string;
    callback: { (results: any): void; (arg0: { message: any; code: number; }): any; };
}

class AnalyseController {
    // public analyseFunction: (params: Summary["params"], callback: Summary["callback"]) => Promise<any> = async (params, callback) => {
    //     try {
    //         const query: (arg: any) => Promise<any> = async (filename) => {
    //             try {
    //                 const { path } = filename;
    //                 const data: Buffer = readFileSync(path);
    //                 const response: AxiosResponse<any,any> = await axios.post(
    //                     "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
    //                     data,
    //                     {
    //                         headers: { Authorization: "Bearer "+process.env.HF_API_KEY }
    //                     }

    //                 );
    //                 const result: any = await response.data;
    //                 if(response.status !== 200)
    //                 {
    //                     console.log("Analyse Function : "+result);
    //                     return callback({ message: result, code: response.status})
    //                 }
    //                 else
    //                 {
    //                     return result;
    //                 }
    //             } 
    //             catch(err: any) {
    //                     console.log("Analyse Function : "+err);
    //                     return callback({ message: err, code: 500 });
    //                 }
    //         }
            
    //         await query(params).then((response: any) => {
    //             return callback({ message: response, code: 200 });
    //         });
    //     } 
    //     catch (err: any) {
    //         console.log(err);
    //         return callback({ message: "Internal Error", code: 500 });
    //     }
    // }

    // public analysecallbackFunction: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    //     const params: any = req.file;
    //     await this.analyseFunction(params, (results: any) => {
    //         if (!results) {
    //             console.log("Error");
    //             res.status(500).send({
    //                 message: "Internal Error"
    //             });
    //         } else {
    //             res.status(results.code).send({
    //                 message: results.message
    //             });
    //         }
    //     });
    // }

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
                        res.status(200).json({
                            content
                        });
                    }
                    else
                    {
                        res.status(500).json({
                            message: "Internal Error"
                        });
                    }
                }
                catch(err: any) {
                    console.log("Summarize Function : "+err);
                    res.status(500).json({
                        message: err.message
                    });
                }
            }
        }
        catch(err: any) {
            console.log("Analyse Function : "+err);
            res.status(500).json({
                message: err
            });
        }
    }

    // public summarize: (params: Summary["params"], callback: Summary["callback"]) => Promise<any> = async (params, callback) => {
    //     try {
    //         const query: (paragraph: string) => Promise<void | cohereResponse<summarizeResponse>> = async (paragraph) => {
    //             try{
    //                 const response: cohereResponse<summarizeResponse> = await cohere.summarize({ 
    //                     text: paragraph,
    //                     length: 'medium',
    //                     format: 'bullets',
    //                     model: 'summarize-xlarge',
    //                     temperature: 0.3,
    //                 }); 
    //                 const result: cohereResponse<summarizeResponse> = await response;;
    //                 return result;
    //                 } catch (err: any) {
    //                     console.log("Summarize function : "+err);
    //                     return callback({ message: err, code: 500 });
    //                 }
    //         }
    //         await query(params).then((response) => {
    //             return callback({ message: response, code: 200 });
    //         });
    //     } 
    //     catch (err: any) {
    //         console.log(err);
    //         return callback({ message: err, code: 500 });
    //     }
    // }

    // public summarizecallbackFunction: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    //     const params: any = req.body;
    //     await this.summarizeFunction(params.paragraph, (results: any) => {
    //         if (!results) {
    //             console.log("Error");
    //             res.status(500).send("Internal Error");
    //         } else {
    //             res.status(results.code).send(results.message);
    //         }
    //     });
    // };

}

export default AnalyseController;