import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { createConnection } from "typeorm";
import log4js from "log4js";
import morgan from "morgan";
import currentUserChecker from "./config/auth";
import controllers from "./controllers";

log4js.configure({
    appenders: {
        blockchain: {
            type: "file", filename: "blockchain-error.log"
        },
        default: {
            type: "file", filename: "default-error.log"
        }
    },
    categories: {
        default: {
            appenders: ["blockchain"],
            level: "error"
        }
    }
});

const app = createExpressServer({
    currentUserChecker,
    cors: true,
    controllers
});

createConnection().then(async connection => {
    app.use(morgan("combined"));

    app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port 3000!");
    });
}).catch(error => console.log(error));

export default app;