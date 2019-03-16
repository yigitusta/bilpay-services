import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { initBearerStrategy } from "./config/passport";

initBearerStrategy();

const app = express();

createConnection().then(async connection => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan("combined"));
    app.use("/", routes);

    app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port 3000!");
    });
}).catch(error => console.log(error));

export default app;