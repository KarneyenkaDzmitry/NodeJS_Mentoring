import express from "express";
import config from "./config";
import { initialization } from "./loaders";

const launchServer = (): void => {
    const port: number = config.service.port;
    const service = express();

    initialization({ service });

    service.listen(port, () => {
        console.info(`
################################################
🛡️  Server listening on port: | ${port} | 🛡️
################################################
      `);
    });
};

launchServer();
