import { UsersDB } from "../models/users/users";
import { IUser } from "../models/users/user.interface";
const users: IUser[] = [
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c1",
        login: "Burger",
        password: "1q2w3e",
        age: 59,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c2",
        login: "Murger",
        password: "12345",
        age: 49,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c3",
        login: "Vurger",
        password: "qwerty",
        age: 39,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c4",
        login: "Zureh",
        password: "1q2w3e",
        age: 59,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c5",
        login: "Pestr123",
        password: "12345",
        age: 49,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c6",
        login: "Elementsss094",
        password: "qwerty",
        age: 39,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c7",
        login: "Vividus34",
        password: "1q2w3e",
        age: 59,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c8",
        login: "3892Merin",
        password: "12345",
        age: 49,
        isDeleted: false,
    },
    {
        id: "56202344-60f3-482c-88d1-deb27976a3c9",
        login: "Zabeyski23",
        password: "qwerty",
        age: 39,
        isDeleted: false,
    },
];

export const usersDB: UsersDB = new UsersDB(users);
