import { IBaseUser, IUser } from './user.interface';

export interface IUsers {
    findAll(): Promise<IUser[]>;
    find(id: string): Promise<IUser | undefined>;
    getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUser[]>;
    splitOnChunks(users: IUser[], limit: number): Promise<IUser[]>;
    create(baseUser: IBaseUser): Promise<string>;
    update(user: IUser): Promise<IUser>;
    delete(id: string, soft: string | undefined): Promise<IUser>;
}