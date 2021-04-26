import { Sequelize } from "sequelize";
import { User } from "../data-access/orm/users";
import { Group } from "../data-access/orm/groups";
import { UserGroup } from "../data-access/orm/user_group";

export const databaseLoader = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await User.sync();
        await Group.sync();
        await UserGroup.sync();
        console.log("Databases have been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw new Error("Database initialization Error");
    }
};
