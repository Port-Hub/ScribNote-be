const path = require("path");
const multer = require("multer");
const fs = require("fs");

const Router = require("express").Router;

const storage = multer.diskStorage({
    destination: "./public/audio/",
    filename: function(req, file, cb){
       cb(null,"VOICE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const upload = multer({
    storage: storage,
    limits:{fileSize: 100000000},
 }).single("myVoice");

const analyse = Router();



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
            console.log(JSON.stringify(response));
            return callback({ message: response, code: 200 });
        });
    } 
    catch (err) {
        console.log(err);
        return callback({ message: "Internal Error", code: 500 });
    }
  
}

// API Analyse Page
// analyse.post("/", {
//     upload(req, res, (err) => {
//        console.log("Request ---", req.body);
//        console.log("Request file ---", req.file);//Here you get file.
//        /*Now do where ever you want to do*/
//        if(!err){
//           return res.send(200).end()
//        };
//     });
//  });

analyse.post("/",upload, async (req, res) => {
    params = req.file;
    await analyseFunction(params, (results) => {
        if (!results) {
            console.log("Error");
            res.status(500).send("Internal Error");
        } else {
            res.status(results.code).send(results.message);
        }
    });
});

module.exports = analyse;