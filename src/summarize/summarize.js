const cohere = require("cohere-ai");
const dotenv = require("dotenv");
dotenv.config();

const summarizeFunction = async (params, callback) => {
    try {
        cohere.init(process.env.COHERE_API_KEY);
        async function query(paragraph) {
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

module.exports = summarizeFunction;