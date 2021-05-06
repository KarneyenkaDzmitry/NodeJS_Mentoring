import { NextFunction, Request, Response } from "express";
import { getServiceLogger } from "../../config/winston.logger.config";
const logger = getServiceLogger("greeting");

export const helloWorld = (req: Request, res: Response, next: NextFunction): void => {
    logger.info("Hello World!");
    res.send("Hello World!");
};
