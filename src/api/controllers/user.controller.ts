import { usersDB } from "../../service/db/used.db.trial";
import { Request, Response } from "express";
import { IBaseUser, IUser } from "../../models/users/user.interface";
import { userSchema } from "../schemas/user.schema";

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const user: IUser | undefined = await usersDB.find(id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).send(`There is no user with id: [${id}] in DB`);
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const limit: unknown = req.query.limit;
    const loginSubstring: unknown = req.query.loginSubstring;
    try {
        const users: IUser[] = await usersDB.getAutoSuggestUsers(loginSubstring as string, limit as number);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(400).send();
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const user: IBaseUser = req.body;
    try {
        await userSchema.validateAsync(user);
        const id = await usersDB.create(user);
        res.status(200).send(id);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const { body }: { body: IBaseUser } = req;
    const user: IUser = { ...body, id };
    try {
        await userSchema.validateAsync(user);
        const userDB = await usersDB.update(user);
        res.status(200).send(userDB);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const soft: unknown = req.query.soft;
    const id: string = req.params.id;
    try {
        const userDB = await usersDB.delete(id, soft as string);
        res.status(200).send(userDB);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};
