import { IUser, IBaseUser } from "../../models/users/user.interface";
import * as uuid from "uuid";
import { IUsers } from "../../models/users/users.interface";

export class UsersDB implements IUsers {
    constructor(private readonly users: IUser[]) {}

    private sortBDByLogin(left: IUser, right: IUser): number {
        if (right.login > left.login) {
            return -1;
        } else {
            if (right.login < left.login) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public findAll(): Promise<IUser[]> {
        return Promise.resolve(this.users);
    }

    public find(id: string): Promise<IUser | undefined> {
        return Promise.resolve(this.users.find((user) => user.id === id));
    }

    public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUser[]> {
        let result: IUser[] = [];
        this.users.sort(this.sortBDByLogin);
        result = this.users;
        if (loginSubstring && loginSubstring.length > 0) {
            result = result.filter(({ login }) => login.includes(loginSubstring));
        }
        if (limit > 0) {
            result = await this.splitOnChunks(result, limit);
        }
        return Promise.resolve(result);
    }

    public splitOnChunks(users: IUser[], limit: number): Promise<IUser[]> {
        if (users.length <= limit) {
            return Promise.resolve(users);
        } else {
            const chunk: IUser[] = users.slice(0, limit);
            return Promise.resolve(chunk);
        }
    }

    public async create(baseUser: IBaseUser): Promise<string> {
        if ("login" in baseUser && "password" in baseUser && "isDeleted" in baseUser && "age" in baseUser) {
            const userBD = await this.users.find((_user) => _user.login === baseUser.login);
            if (userBD) throw new Error(`User with Login [${baseUser.login}] already exists!`);
            const user: IUser = { ...baseUser, id: uuid.v4() };
            this.users.push(user);
            return Promise.resolve(user.id);
        } else {
            throw new Error("The object does not fulfill the expectations");
        }
    }

    public async update(user: IUser): Promise<IUser> {
        if (!uuid.validate(user.id)) throw new Error(`Invalid ID: [${user.id}]`);

        const userDB: IUser | undefined = await this.find(user.id);

        if (!userDB) throw new Error("User does not exist! ");

        if ("login" in user && "password" in user && "isDeleted" in user && "age" in user && "id" in user) {
            const index: number = this.users.findIndex((usr) => usr.id === user.id);
            console.debug("Index: [%s]", index);
            if (index < 0) throw new Error("User Not found in DB");
            const removed = this.users.splice(index, 1, user);
            console.debug("Removed: [%o]", removed[0]);
            console.debug(await this.find(user.id));
            return Promise.resolve(user);
        } else {
            throw new Error("The object does not fulfill the expectations");
        }
    }

    public async delete(id: string, soft: string | undefined): Promise<IUser> {
        if (!uuid.validate(id)) throw new Error(`Invalid ID: [${id}]`);

        const userDB: IUser | undefined = await this.find(id);

        if (!userDB) throw new Error("User does not exist! ");

        const index: number = this.users.findIndex((user) => user.id === id);

        if (index < 0) throw new Error("User Not found in DB");

        if (soft === "true") {
            this.users[index].isDeleted = true;

            console.debug(this.users[index]);
            return Promise.resolve(this.users[index]);
        } else {
            const removed = this.users.splice(index, 1);
            console.debug("Removed: [%o]", removed[0]);
            return Promise.resolve(removed[0]);
        }
    }
}
