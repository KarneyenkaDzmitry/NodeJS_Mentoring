import { Application, json } from "express";
import cors from "cors";
import * as userRouter from "../api/routes/user.route";
import * as groupRouter from "../api/routes/group.route";
import * as greetingRouter from "../api/routes/greeting.route";
import { http_loggers } from "../config/http_logger.config";
import { full_log, error_log } from "../config/winston.logger.config";
import { errorHandler } from "../api/controllers/error.service.controller";
import * as errorRouter from "../api/routes/error.route";
import * as loginRouter from "../api/routes/login.route";
import { tokenGateway } from "../api/controllers/passport.controller";

export const expressLoader = ({ service }: { service: Application }): Application => {
    http_loggers.forEach((logger) => service.use(logger));
    service.use(full_log);
    service.use(json());
    service.use(cors());
    service.use(greetingRouter.router);
    service.use("/api/v1/login", loginRouter.router);
    service.use("/api/v1/error", tokenGateway, errorRouter.router);
    service.use("/api/v1/user", tokenGateway, userRouter.router);
    service.use("/api/v1/group", tokenGateway, groupRouter.router);
    service.use(error_log);
    service.use(errorHandler);

    return service;
};

/** This snippet of test in used to verify case when un caught Exception is thrown */
const KABOOM = parseInt(process.env.KABOOM as string, 10) || 0;
if (KABOOM) {
    setTimeout(() => {
        throw new Error("Uncaught Exception Thrown somewhere!");
    }, KABOOM);
}
