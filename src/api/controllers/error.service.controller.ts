import { Request, Response, NextFunction } from "express";
import { getServiceLogger } from "../../config/winston.logger.config";
const logger = getServiceLogger("errorHandler");
import { ServiceError, InternalServerError } from "../../models/errors/error.models";

export const errorHandler = (error: ServiceError, req: Request, res: Response, next: NextFunction): void => {
    let err = null;
    if (!(error.code || error.method || error.name || error.status)) {
        err = new InternalServerError({
            message: error.message,
            method: errorHandler.name,
            arguments: {},
        });
    } else err = error;
    logger.error(err);
    res.status(err.status).send({ message: err.message });
};

export const uncaughtException = (req: Request, res: Response): void => {
    throw new Error("Uncaught Exception Error is thrown!");
};

export const unhandledRejectionError = (req: Request, res: Response): void => {
    throw new Error("Unhandled Rejection Error is thrown!");
};
