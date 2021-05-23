import { TLogin } from "../types/login.type";
import { User } from "../data-access/orm/users";
import { BadCredentialsError, UnauthorizedError } from "../models/errors/error.models";
import jwt from "jsonwebtoken";
import { configs } from "../config/index";
import { TUser } from "../types/base.user.type";
const {
    jwt: { secret, expiresIn },
} = configs;

export class LoginService {
    public static async authenticate(credentials: TLogin): Promise<string> {
        const { username, password }: { username: string; password: string } = credentials;
        const user: User | null = await User.findUserByCreeds(username, password);
        if (!user) {
            throw new BadCredentialsError({
                message: `Bad username/password combination.`,
                method: LoginService.authenticate.name,
                arguments: { username, password },
            });
        } else {
            const usr: TUser = user.toJSON() as TUser;
            if (!usr.isDeleted) {
                const payload = { public: this.algorithm(usr) };
                const token: string = jwt.sign(payload, secret, { expiresIn });
                return Promise.resolve(token);
            } else {
                throw new BadCredentialsError({
                    message: `Bad username/password combination.`,
                    method: LoginService.authenticate.name,
                    arguments: { username, password },
                });
            }
        }
    }

    public static validate(token: string): Promise<boolean> {
        if (token) {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-types
                const encoded: string | object = jwt.verify(token, secret);
                if (encoded) return Promise.resolve(true);
                return Promise.resolve(false);
            } catch (error) {
                throw new BadCredentialsError({
                    message: `Failed to authenticate token!`,
                    method: LoginService.validate.name,
                    arguments: { token },
                });
            }
        } else {
            throw new UnauthorizedError({
                message: `Forbidden. No token is provided!`,
                method: LoginService.validate.name,
                arguments: { token },
            });
        }
    }

    private static algorithm(user: TUser): string {
        const array = user.id.split(/-/);
        array.splice(getRandomIntNumber(0, array.length - 1), 0, user.age.toString());
        return array.join("");
    }
}

/**
 * Returns an integer number in terms of min and max Numbers
 * @param {Number} min A minimal value (included). Default 0.
 * @param {Number} max A maximal value (excluded). Default Number.MAX_SAFE_INTEGER.
 */
export const getRandomIntNumber = (min = 0, max = Number.MAX_SAFE_INTEGER): number => Math.floor(Math.random() * (max - min + 1)) + min;
