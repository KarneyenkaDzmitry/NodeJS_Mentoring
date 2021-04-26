import { Request, Response } from "express";
import { Group } from "../../data-access/orm/groups";
import { TGroup, TBaseGroup } from "../../types/group.type";
import { UserGroup } from "../../data-access/orm/user_group";

export const getGroup = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const group: Group | null = await Group.findGroup(id);
    if (group) {
        res.status(200).json(group);
    } else {
        res.status(400).send(`There is no group with id: [${id}] in DB`);
    }
};

export const getGroups = async (req: Request, res: Response): Promise<void> => {
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
        console.error(error);
        res.status(400).send();
    }
};

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    const group: TGroup = req.body;
    try {
        const [dbGroup, status] = await Group.createGroup(group);
        if (status) {
            res.status(200).json(dbGroup);
        } else {
            res.status(201).json(dbGroup);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const { body }: { body: TBaseGroup } = req;
    const group: TGroup = { ...body, id };
    try {
        const [, groupDB] = await Group.updateGroup(group);
        res.status(200).json(groupDB);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    try {
        const [number] = await Group.deleteGroup(id);
        console.log(number);
        res.status(200).json({ number });
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const addUsersToGroup = async (req: Request, res: Response): Promise<void> => {
    const { userIds, groupId }: { userIds: string[]; groupId: string } = req.body;
    try {
        const number = await UserGroup.addUsersToGroup(groupId, userIds);
        console.log(number);
        if (number > 0) res.status(200).json({ number });
        else res.status(500).send("Transaction failure.");
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};
