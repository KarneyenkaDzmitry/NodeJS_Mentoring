import express, { Request, Response } from 'express';
import assert from 'assert';
import { create } from 'ts-node';
import { usersDB } from './db/used.db.trial';
import { BaseUser, User } from './models/users/user.interface';
import bodyParser from 'body-parser';
// import cors from "cors";
// import helmet from "helmet";


/**
 *  App Configuration
 */
const service = express();
// service.use(helmet());
// service.use(cors());
service.use(express.json());

service.get('/', (req: Request, res: Response): any => {
    res.send('Hello World!')
})

service.get('/api/user/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const user: User | undefined = await usersDB.find(id as string);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).send(`There is no user with id: [${id}] in DB`);
    }
})

service.get('/api/users', async (req: Request, res: Response) => {
    const users: User[] = await usersDB.findAll();
    res.status(200).json(users);
})

service.post('/api/user', async (req: Request, res: Response): Promise<any> => {
    const user: BaseUser = req.body;
    try {
        const id = await usersDB.create(user);
        res.status(200).send(id);
    } catch (error) {
        console.error(error.message)
        res.status(400).send(error.message)
    }
})

service.put('/api/user/:id', async (req: Request, res: Response): Promise<any> => {
    const id: string = req.params.id;
    const { body }: { body: BaseUser } = req;
    const user: User = { ...body, id }
    try {
        const userDB = await usersDB.update(user);
        res.status(200).send(userDB);
    } catch (error) {
        console.error(error.message)
        res.status(400).send(error.message)
    }
})


service.delete('/api/user/:id', async (req: Request, res: Response): Promise<any> => {
    const soft: unknown = req.query.soft;
    const id: string = req.params.id;
    try {
        const userDB = await usersDB.delete(id, soft as string);
        res.status(200).send();
    } catch (error) {
        console.error(error.message)
        res.status(400).send(error.message)
    }
})

export { service };