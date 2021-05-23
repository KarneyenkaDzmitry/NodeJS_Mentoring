import { Request, Response, NextFunction } from "express";
import { getServiceLogger } from "../../config/winston.logger.config";
const logger = getServiceLogger("tokenGateway");
import { LoginService } from "../../services/login.service";

export const tokenGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string = (req.headers["x-access-token"] as string) || "";
    try {
        await LoginService.validate(token);
        next();
    } catch (error) {
        next(error);
    }
};
