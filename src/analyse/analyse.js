const fs = require("fs");

const analyseFunction = async (params, callback) => {
    try {
        async function query(filename) {
            try{
                const { path } = filename;
                const data = fs.readFileSync(path);
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
                    {
                        headers: { Authorization: "Bearer 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" },
                        method: "POST",
                        body: data,
                    }
                );
                const result = await response.json();
                return result;
                } catch (err) {
                    console.log(err);
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

module.exports = analyseFunction;