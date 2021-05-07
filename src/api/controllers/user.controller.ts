import { NextFunction, Request, Response } from "express";
import { IBaseUser, IUser } from "../../models/interfaces/user.interface";
import { User } from "../../data-access/orm/users";
import { NotFoundError, BadRequestError } from "../../models/errors/error.models";

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.params.id;
    try {
        const user: User | null = await User.findUser(id);
        if (user) {
            res.status(200).json(user);
        } else {
            throw new NotFoundError({
                message: `There is no user with id: [${id}] in DB`,
                method: getUserById.name,
                arguments: { id },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: IBaseUser = req.body;
    try {
        const [dbUser, status] = await User.createUser(user);
        if (status) {
            res.status(200).json(dbUser);
        } else {
            throw new BadRequestError({
                message: `User with login [${user.login}] already exist.`,
                method: createUser.name,
                arguments: { user },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.params.id;
    const { body }: { body: IBaseUser } = req;
    const user: IUser = { ...body, id };
    try {
        const [number] = await User.updateUser(user);
        if (number === 0) {
            throw new BadRequestError({
                message: `User with id [${id}] has not been updated.`,
                method: updateUser.name,
                arguments: { user },
            });
        } else {
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const soft: boolean = req.query.soft === "false" ? false : true;
    const id: string = req.params.id;
    try {
        const [number] = await User.deleteUser(id, soft);
        if (number === 0) {
            throw new BadRequestError({
                message: `User with id [${id}] does not exist!`,
                method: deleteUser.name,
                arguments: { id, soft },
            });
        } else {
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
};
