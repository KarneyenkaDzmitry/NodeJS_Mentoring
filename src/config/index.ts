import { config } from "dotenv";
config();

const { SERVICE_PORT, SERVICE_ENV, DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;
const { JWT_SECRET, JWT_EXPIRATION_TERM, JWT_PRIVATE_KEY } = process.env;

export const configs = {
    service: {
        port: parseInt(SERVICE_PORT as string, 10) || 3000,
        environment: SERVICE_ENV || "develop",
    },
    db: {
        username: DB_USER || "",
        password: DB_PASSWORD || "",
        database: DB_NAME || "",
        host: DB_HOST || "",
        port: parseInt(DB_PORT as string, 10) || 5432,
    },
    jwt: {
        secret: JWT_SECRET as string,
        expiresIn: parseInt(JWT_EXPIRATION_TERM as string, 10) || 600,
    },
};
