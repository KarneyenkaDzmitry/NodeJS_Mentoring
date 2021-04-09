import { Request, Response } from "express";
import { IBaseUser, IUser } from "../../models/interfaces/user.interface";
import { userSchema } from "../schemas/user.schema";
import { User } from "../../data-access/orm/users";

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const user: User | null = await User.findUser(id);
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
        let users: User[] | null;
        if (loginSubstring && (loginSubstring as string).length > 0 && (limit as number) > 0) {
            users = await User.getAutoSuggestUsers(loginSubstring as string, limit as number);
        } else {
            users = await User.findUsers();
        }

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
        const [dbUser, status] = await User.createUser(user);
        if (status) {
            res.status(200).send(dbUser);
        } else {
            res.status(201).send(dbUser);
        }
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
        const [, userDB] = await User.updateUser(user);
        res.status(200).send(userDB);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    try {
        const number = await User.deleteUser(id);
        console.log(number);
        res.status(200).send({ number });
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};
