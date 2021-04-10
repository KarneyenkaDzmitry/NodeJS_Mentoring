import express from "express";
import { configs } from "./config";
import { initialization } from "./loaders";

const launchServer = async (): Promise<void> => {
    const port: number = configs.service.port;
    const service = express();

    try {
        await initialization({ service });

        service.listen(port, () => {
            console.info(`
    ################################################
    🛡️  Server listening on port: | ${port} | 🛡️
    ################################################
          `);
        });
    } catch (error) {
        console.error("ERROR: | %o |", error.message);
    }
};

launchServer();
