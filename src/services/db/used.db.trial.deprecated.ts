import { UsersDB } from "./users.deprecated";
import { IUser } from "../../models/interfaces/user.interface";
import { db } from "./db.deprecated";
const users: IUser[] = db;

export const usersDB: UsersDB = new UsersDB(users);
