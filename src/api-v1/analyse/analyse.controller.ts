import { Request, Response } from "express";
import { readFileSync } from "fs";

class AnalyseController {
    public analyseFunction = async (params: any, callback: (arg0: { message: any; code: number; }) => any) => {
        try {
            const query = async (filename: any) => {
                try{
                    const { path } = filename;
                    const data: Buffer = readFileSync(path);
                    const response: any = await fetch(
                        "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
                        {
                            headers: { Authorization: "Bearer "+process.env.HF_API_KEY },
                            method: "POST",
                            body: data,
                        }
                    );
                    const result: any = await response.json();
                    if(result.error)
                    {
                        console.log("Analyse Function : "+result.error);
                        return callback({ message: result.error, code: 500})
                    }
                    else
                    {
                        return result;
                    }
                    } catch (err) {
                        console.log("Analyse Function : "+err);
                        return callback({ message: "Internal Error", code: 500 });
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

    public callbackFunction = async (req: Request, res: Response) => {
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