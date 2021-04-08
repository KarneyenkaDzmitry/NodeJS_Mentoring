import express from "express";
import * as userRouter from "../api/routes/user.route";
import * as greetingRouter from "../api/routes/greeting.route";

const service = express();
service.use(express.json());
service.use("/api/v1/user", userRouter.router);
service.use(greetingRouter.router);

export { service };
