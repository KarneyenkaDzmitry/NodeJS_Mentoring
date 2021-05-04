import { Application, json } from "express";
import * as userRouter from "../api/routes/user.route";
import * as groupRouter from "../api/routes/group.route";
import * as greetingRouter from "../api/routes/greeting.route";
import { http_loggers } from "../config/http_logger.config";

export const expressLoader = ({ service }: { service: Application }): Application => {
    http_loggers.forEach((logger) => service.use(logger));
    service.use(json());
    service.use("/api/v1/user", userRouter.router);
    service.use("/api/v1/group", groupRouter.router);
    service.use(greetingRouter.router);
    return service;
};
