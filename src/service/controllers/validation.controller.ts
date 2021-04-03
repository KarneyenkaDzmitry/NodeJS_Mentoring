import { Request, Response, NextFunction } from 'express';
import { ValidationResult, Schema } from 'joi';

const defaultOptions = { abortEarly: false, allowUnknown: false }

export const validatePrams = (schema: Schema, options: any = defaultOptions) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result: ValidationResult = schema.validate(req.params, options);
        if (result.error?.isJoi) {
            res.status(400).json(errorComposer(result.error?.details));
        } else {
            next();
        }
    };

export const validateBody = (schema: Schema, options: any = defaultOptions) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result: ValidationResult = schema.validate(req.body, options);
        if (result.error?.isJoi) {
            res.status(400).json(errorComposer(result.error?.details));
        } else {
            next();
        }
    };

const errorComposer = (schemaErrors: Array<any>): object => {
    const errors = schemaErrors.map(({ path, message }) => ({ path, message }));
    return ({ status: "failed", errors })
}