import { Request, Response } from "express";

export const helloWorld = (req: Request, res: Response): any => {
    res.send("Hello World!");
};
