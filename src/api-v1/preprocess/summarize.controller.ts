import * as cohere from "cohere-ai";
import { Request, Response } from "express";

export default class SummarizeController {
    public summarizeFunction = async (params: string, callback: { (results: any): void; (arg0: { message: any; code: number; }): any; }) => {
        try {
            const coherekey: string = process.env.COHERE_API_KEY!
            cohere.init(coherekey);
            async function query(paragraph: string) {
                try{
                    const response = await cohere.summarize({ 
                        text: paragraph,
                        length: 'medium',
                        format: 'bullets',
                        model: 'summarize-xlarge',
                        temperature: 0.3,
                    }); 
                    const result = await response;;
                    return result;
                    } catch (err) {
                        console.log("Summarize function : "+err);
                        return callback({ message: "Internal Error", code: 500 });
                    }
            }
            await query(params).then((response) => {
                return callback({ message: response, code: 200 });
            });
        } 
        catch (err) {
            console.log(err);
            return callback({ message: "Internal Error", code: 500 });
        }
    }

    public callbackFunction = async (req: Request, res: Response) => {
        const params = req.body;
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