import { Sequelize } from "sequelize";

export const databaseLoader = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
    console.log("Before DB Authenticate");
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
