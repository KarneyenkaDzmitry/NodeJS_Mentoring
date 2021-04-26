import { Request, Response } from "express";
import { IBaseUser, IUser } from "../../models/interfaces/user.interface";
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
    const limit: number = parseInt(req.query.limit as string, 10) || 0;
    const loginSubstring: string = req.query.loginSubstring as string;
    try {
        let users: User[] | null;
        if (loginSubstring && loginSubstring.length > 0 && limit > 0) {
            users = await User.getAutoSuggestUsers(loginSubstring, limit);
        } else {
            users = await User.findUsers(limit);
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
        const [dbUser, status] = await User.createUser(user);
        if (status) {
            res.status(200).json(dbUser);
        } else {
            res.status(201).json(dbUser);
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
        const [, userDB] = await User.updateUser(user);
        res.status(200).json(userDB);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const soft: boolean = req.query.soft === "false" ? false : true;
    const id: string = req.params.id;
    try {
        const [number] = await User.deleteUser(id, soft);
        console.log(number);
        res.status(200).json({ number });
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};
