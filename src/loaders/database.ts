import { Sequelize } from "sequelize";
import { User } from "../data-access/orm/users";
import { Group } from "../data-access/orm/groups";
import { UserGroup } from "../data-access/orm/user_group";
import { getServiceLogger } from "../config/winston.logger.config";
const logger = getServiceLogger("Database");

export const databaseLoader = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
    try {
        await sequelize.authenticate();
        logger.info("Connection has been established successfully.");
        await User.sync();
        await Group.sync();
        await UserGroup.sync();
        logger.info("Databases have been synchronized successfully.");
    } catch (error) {
        logger.error(error);
        throw new Error("Database initialization Error");
    }
};

export const databaseDisconnect = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
    try {
        await sequelize.close();
        logger.info("Connection has been closed.");
    } catch (error) {
        logger.error("Unable to close to the database:", error);
        throw new Error("Database disconnection Error");
    }
};
