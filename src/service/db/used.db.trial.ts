import { UsersDB } from '../models/users/users';
import { User } from '../models/users/user.interface';
const users: User[] = [
    {
        id: '56202344-60f3-482c-88d1-deb27976a3c1',
        login: 'Burger',
        password: '1q2w3e',
        age: 59,
        isDeleted: false,
    },
    {
        id: '56202344-60f3-482c-88d1-deb27976a3c2',
        login: 'Murger',
        password: '12345',
        age: 49,
        isDeleted: false,
    },
    {
        id: '56202344-60f3-482c-88d1-deb27976a3c3',
        login: 'Vurger',
        password: 'qwerty',
        age: 39,
        isDeleted: false,
    },
]

export const usersDB: UsersDB = new UsersDB(users);
