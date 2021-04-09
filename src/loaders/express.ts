import { Application, json } from "express";
import * as userRouter from "../api/routes/user.route";
import * as greetingRouter from "../api/routes/greeting.route";

export const expressLoader = ({ service }: { service: Application }): Application => {
    service.use(json());
    service.use("/api/v1/user", userRouter.router);
    service.use(greetingRouter.router);
    return service;
};
