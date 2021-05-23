import { Request, Response, NextFunction } from "express";
import { getServiceLogger } from "../../config/winston.logger.config";
const logger = getServiceLogger("loginService");
import { LoginService } from "../../services/login.service";
import { TLogin } from "../../types/login.type";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const credentials: TLogin = req.body;
    try {
        const token = await LoginService.authenticate(credentials);
        res.send(token);
    } catch (error) {
        next(error);
    }
};
