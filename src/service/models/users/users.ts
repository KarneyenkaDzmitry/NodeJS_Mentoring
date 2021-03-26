import { Users } from './users.interface';
import { User, BaseUser } from './user.interface';
import * as uuid from 'uuid';
import { usersDB } from '../../db/used.db.trial';

export class UsersDB implements Users {

    users: User[];

    constructor(users: User[]) { this.users = users; }

    findAll(): Promise<User[]> { return Promise.resolve(this.users) };

    find(id: string): Promise<User | undefined> { return Promise.resolve(this.users.find(user => user.id === id)) };

    async create(baseUser: BaseUser): Promise<string> {
        if ("login" in baseUser && "password" in baseUser && "isDeleted" in baseUser && "age" in baseUser) {
            const userBD = await this.users.find(user => user.login === baseUser.login);
            if (userBD) throw new Error(`User with Login [${baseUser.login}] already exists!`)
            const user: User = { ...baseUser, id: uuid.v4() }
            this.users.push(user);
            return Promise.resolve(user.id);
        } else {
            throw new Error("The object does not fulfill the expectations");
        }

    };

    async update(user: User): Promise<User> {

        if (!uuid.validate(user.id)) throw new Error(`Invalid ID: [${user.id}]`);

        let userDB: User | undefined = await this.find(user.id);

        if (!userDB) throw new Error("User does not exist! ");

        if ("login" in user && "password" in user && "isDeleted" in user && "age" in user && "id" in user) {

            const index: number = this.users.findIndex(usr => usr.id === user.id);
            console.log(index);
            if (index < 0) throw new Error("User Not found in DB");
            const removed = this.users.splice(index, 1, user);
            console.debug('Removed: [%o]', removed[0]);
            console.debug(await this.find(user.id));
            return Promise.resolve(user);
        } else {
            throw new Error("The object does not fulfill the expectations");
        }
    }

    async delete(id: string, soft: string | undefined): Promise<User> {
        if (!uuid.validate(id)) throw new Error(`Invalid ID: [${id}]`);

        let userDB: User | undefined = await this.find(id);

        if (!userDB) throw new Error("User does not exist! ");

        const index: number = this.users.findIndex(user => user.id === id);

        if (index < 0) throw new Error("User Not found in DB");

        if (soft === 'true') {

            this.users[index].isDeleted = true;

            console.debug(this.users[index]);
            return Promise.resolve(this.users[index]);
        } else {
            const removed = this.users.splice(index, 1);
            console.debug('Removed: [%o]', removed[0]);
            return Promise.resolve(removed[0]);
        }
    }
}