import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import home from "./home";
import * as errorHandler from "./helpers/errorHandler";
import apiV1 from "./api-v1/index";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(bodyParser.urlencoded({ extended : true }));
    this.express.use(express.urlencoded({ extended : false }));
  }

  private setRoutes(): void {
    this.express.all("/*", function (req: express.Request, res: express.Response, next: express.NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    this.express.use("/", home);
    this.express.use("/v1",apiV1);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }

}

export default new App().express;