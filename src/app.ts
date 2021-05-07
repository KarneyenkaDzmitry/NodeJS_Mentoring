import express from "express";
import { configs } from "./config";
import { initialization } from "./loaders";
import { getServiceLogger } from "./config/winston.logger.config";
const logger = getServiceLogger("Server");
import { subscribeToErrors } from "./subscribes/process";

const launchServer = async (): Promise<void> => {
    const port: number = configs.service.port;
    const service = express();

    await initialization({ service });

    const application = service.listen(port, () => {
        logger.info(`
    ################################################
    🛡️  Server listening on port: | ${port} | 🛡️
    ################################################
          `);
    });

    subscribeToErrors(application);
};

launchServer();
