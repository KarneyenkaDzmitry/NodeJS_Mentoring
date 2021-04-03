export interface IBaseUser {
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export interface IUser extends IBaseUser {
    id: string;
}