import { Request, Response, NextFunction } from "express";
import { ValidationResult, Schema, ValidationOptions } from "joi";

const defaultOptions: ValidationOptions = { abortEarly: false, allowUnknown: false };

export const validatePrams = (schema: Schema, options: ValidationOptions = defaultOptions) => (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const result: ValidationResult = schema.validate(req.params, options);
    if (result.error?.isJoi) {
        res.status(400).json(errorComposer(result.error?.details));
    } else {
        next();
    }
};

export const validateBody = (schema: Schema, options: ValidationOptions = defaultOptions) => (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const result: ValidationResult = schema.validate(req.body, options);
    if (result.error?.isJoi) {
        res.status(400).json(errorComposer(result.error?.details));
    } else {
        next();
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorComposer = (schemaErrors: any[]): any => {
    const errors = schemaErrors.map(({ path, message }) => ({ path, message }));
    return { status: "failed", errors };
};
