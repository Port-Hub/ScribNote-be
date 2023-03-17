
const summarizeFunction = async (params, callback) => {
    try {
        async function query(paragraph) {
            try{
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                    {
                        headers: { Authorization: "Bearer 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" },
                        method: "POST",
                        body: paragraph,
                    }
                );
                const result = await response.json();
                console.log(result)
                return result;
                } catch (err) {
                    console.log(err);
                    return callback({ message: "Internal Error", code: 500 });
                }
        }
        
        await query({"inputs":params}).then((response) => {
            return callback({ message: response, code: 200 });
        });
    } 
    catch (err) {
        console.log(err);
        return callback({ message: "Internal Error", code: 500 });
    }
  
}

module.exports = summarizeFunction;