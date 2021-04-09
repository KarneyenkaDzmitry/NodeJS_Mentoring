import { config } from "dotenv";
config();

const { SERVICE_PORT, SERVICE_ENV } = process.env;

export default {
    service: {
        port: parseInt(SERVICE_PORT as string, 10) || 3000,
        environment: SERVICE_ENV || "develop",
    },
};
