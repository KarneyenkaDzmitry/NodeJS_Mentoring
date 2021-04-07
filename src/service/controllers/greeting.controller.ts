import { Request, Response } from "express";

export const helloWorld = (req: Request, res: Response): void => {
    res.send("Hello World!");
};
