import { UsersDB } from "./users";
import { IUser } from "../../models/interfaces/user.interface";
import { db } from "./db";
const users: IUser[] = db;

export const usersDB: UsersDB = new UsersDB(users);
