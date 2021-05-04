import { Application, json } from "express";
import * as userRouter from "../api/routes/user.route";
import * as groupRouter from "../api/routes/group.route";
import * as greetingRouter from "../api/routes/greeting.route";
import { http_loggers } from "../config/http_logger.config";
import { winstonLoggers } from "../config/winston.logger.config";

export const expressLoader = ({ service }: { service: Application }): Application => {
    http_loggers.forEach((logger) => service.use(logger));
    service.use(winstonLoggers[0]);
    service.use(json());
    service.use("/api/v1/user", userRouter.router);
    service.use("/api/v1/group", groupRouter.router);
    service.use(greetingRouter.router);
    service.use(winstonLoggers[1]);

    return service;
};
