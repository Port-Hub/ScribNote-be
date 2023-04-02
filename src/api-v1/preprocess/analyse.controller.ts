import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { readFileSync } from "fs";

class AnalyseController {
    public analyseFunction = async (params: any, callback: (arg0: { message: any; code: number; }) => any) => {
        try {
            const query: (arg: any) => Promise<any> = async (filename) => {
                try{
                    const { path } = filename;
                    const data: Buffer = readFileSync(path);
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
                        return callback({ message: result, code: response.status})
                    }
                    else
                    {
                        return result;
                    }
                    } catch (err) {
                        console.log("Analyse Function : "+err);
                        return callback({ message: err, code: 500 });
                    }
            }
            
            await query(params).then((response: any) => {
                return callback({ message: response, code: 200 });
            });
        } 
        catch (err: any) {
            console.log(err);
            return callback({ message: "Internal Error", code: 500 });
        }
    }

    public callbackFunction: (req: any, res: any) => Promise<void> = async (req, res) => {
        const params: any = req.file;
        await this.analyseFunction(params, (results: any) => {
            if (!results) {
                console.log("Error");
                res.status(500).send("Internal Error");
            } else {
                res.status(results.code).send(results.message);
            }
        });
    }
}

export default AnalyseController;