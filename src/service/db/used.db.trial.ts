import { UsersDB } from "./users";
import { IUser } from "../../models/users/user.interface";
import { db } from "./db";
const users: IUser[] = db;

export const usersDB: UsersDB = new UsersDB(users);
