import express from "express";
import { configs } from "./config";
import { initialization } from "./loaders";
import { getServiceLogger } from "./config/winston.logger.config";
const logger = getServiceLogger("Server");

const launchServer = async (): Promise<void> => {
    const port: number = configs.service.port;
    const service = express();

    await initialization({ service });

    const application = service.listen(port, () => {
        console.info(`
    ################################################
    🛡️  Server listening on port: | ${port} | 🛡️
    ################################################
          `);
    });

    process.on("uncaughtException", (error) => {
        logger.info("Throw Error Service!");
        application.close((error) => {
            logger.info("Application closed carefully!");
        });
        process.exit(1);
    });

    process.on("unhandledRejection", (error) => {
        logger.info("Throw Error Service!");
        application.close((error) => {
            logger.info("Application closed carefully!");
        });
        process.exit(1);
    });
};

launchServer();
