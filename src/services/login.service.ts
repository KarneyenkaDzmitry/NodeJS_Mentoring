import { TLogin } from "../types/login.type";
import { User } from "../data-access/orm/users";
import { BadCredentialsError, UnauthorizedError } from "../models/errors/error.models";
import jwt from "jsonwebtoken";
import { configs } from "../config/index";
const {
    jwt: { secret, expiresIn },
} = configs;

export class LoginService {
    public static async authenticate(credentials: TLogin): Promise<string> {
        const { username, password }: { username: string; password: string } = credentials;
        const user = await User.findUserByCreeds(username, password);
        if (!user) {
            throw new BadCredentialsError({
                message: `Bad username/password combination.`,
                method: LoginService.authenticate.name,
                arguments: { username, password },
            });
        } else {
            const payload = { ...credentials };
            const token: string = jwt.sign(payload, secret, { expiresIn });
            return Promise.resolve(token);
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
}
