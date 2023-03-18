const Router = require("express").Router;
const summarizeFunction = require("./summarize");

const summarize = Router();

summarize.post("/", async (req, res) => {
    params = req.body;
    await summarizeFunction(params.paragraph, (results) => {
        if (!results) {
            console.log("Error");
            res.status(500).send("Internal Error");
        } else {
            res.status(results.code).send(results.message);
        }
    });
});

module.exports = summarize;