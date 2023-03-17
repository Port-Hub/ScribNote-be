const path = require("path");
const multer = require("multer");
const analyseFunction = require("./analyse");

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