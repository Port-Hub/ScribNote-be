const cohere = require("cohere-ai");
const dotenv = require("dotenv");
dotenv.config();

const summarizeFunction = async (params, callback) => {
    try {
        if(!params) return callback({ message: "Upload supported audio files", code: 500 }) 
        else
        {
        cohere.init(process.env.COHERE_API_KEY);
        async function query(paragraph) {
            try{
                const response = await cohere.summarize({ 
                    text: paragraph,
                    length: 'long',
                    format: 'bullets',
                    model: 'summarize-xlarge-5',
                    temperature: 0.1,
                  }); 
                const result = await response;
                return result;
                } catch (err) {
                    console.log("Summarize function : "+err);
                    return callback({ message: "Summarize Error", code: 500 });
                }
        }
        await query(params).then((response) => {
            return callback({ message: response, code: 200 });
        });
    }
    } 
    catch (err) {
        console.log(err);
        return callback({ message: "Internal Error", code: 500 });
    }
  
}

module.exports = summarizeFunction;