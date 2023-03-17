const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const analyse = require("./analyse");
const home = require("./home");

class App {
  express;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares() {
    this.express.use(cors({
        origin: "*",
        credentials: true,
      }));
    this.express.options("*", cors());
    this.express.use(express.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(express.urlencoded({ extended:false }));
  }

  setRoutes() {
    this.express.all("/*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    this.express.use("/", home);

    this.express.use("/analyse", analyse);


  }

}

module.exports = new App().express;