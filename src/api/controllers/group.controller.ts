import { NextFunction, Request, Response } from "express";
import { Group } from "../../data-access/orm/groups";
import { TGroup, TBaseGroup } from "../../types/group.type";
import { UserGroup } from "../../data-access/orm/user_group";
import { Transaction } from "../../types/user_group.type";
import { NotFoundError, BadRequestError, TransactionError } from "../../models/errors/error.models";

export const getGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.params.id;
    try {
        const group: Group | null = await Group.findGroup(id);
        if (group) {
            res.status(200).json(group);
        } else {
            throw new NotFoundError({
                message: `There is no group with id: [${id}] in DB`,
                method: getGroup.name,
                arguments: { id },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const limit: number = parseInt(req.query.limit as string, 10) || 0;
    const groupSubstring: string = req.query.groupSubstring as string;
    try {
        let groups: Group[] | null;
        if (groupSubstring && groupSubstring.length > 0 && limit > 0) {
            groups = await Group.getAutoSuggestGroups(groupSubstring, limit);
        } else {
            groups = await Group.findGroups(limit);
        }
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const group: TGroup = req.body;
    try {
        const [dbGroup, status] = await Group.createGroup(group);
        if (status) {
            res.status(200).json(dbGroup);
        } else {
            throw new BadRequestError({
                message: `Group with name [${group.name}] already exist.`,
                method: createGroup.name,
                arguments: { group },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.params.id;
    const { body }: { body: TBaseGroup } = req;
    const group: TGroup = { ...body, id };
    try {
        const [number] = await Group.updateGroup(group);
        if (number === 0) {
            throw new BadRequestError({
                message: `User with id [${id}] does not exist!`,
                method: updateGroup.name,
                arguments: { group },
            });
        } else {
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.params.id;
    try {
        const [number] = await Group.deleteGroup(id);
        if (number === 0) {
            throw new BadRequestError({
                message: `User with id [${id}] does not exist!`,
                method: deleteGroup.name,
                arguments: { id },
            });
        } else {
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
};

export const addUsersToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userIds, groupId }: { userIds: string[]; groupId: string } = req.body;
    try {
        const transaction: Transaction = await UserGroup.addUsersToGroup(groupId, userIds);
        if (transaction.number > 0) res.status(200).json(transaction);
        else
            throw new TransactionError({
                message: `No transaction completed.`,
                method: addUsersToGroup.name,
                arguments: { userIds, groupId },
            });
    } catch (error) {
        next(error);
    }
};
