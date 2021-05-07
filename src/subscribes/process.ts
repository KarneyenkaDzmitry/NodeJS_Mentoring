import { Server } from "http";
import { getServiceLogger } from "../config/winston.logger.config";
const logger = getServiceLogger("Server");
import { databaseDisconnect } from "../loaders/database";
import { sequelize } from "../data-access/sequelize";
import { Sequelize } from "sequelize";

const closeApplication = (application: Server, sequelizer: Sequelize): void => {
    application.close(async (error) => {
        await databaseDisconnect({ sequelize: sequelizer });
        logger.info("Application closed carefully!");
        process.exit(1);
    });
};

export const subscribeToErrors = (application: Server): void => {
    process.on("uncaughtException", (error) => {
        logger.error(error.toString());
        closeApplication(application, sequelize);
    });

    process.on("unhandledRejection", (error) => {
        logger.error(error?.toString());
        closeApplication(application, sequelize);
    });
};
