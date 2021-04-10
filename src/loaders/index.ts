import { Application } from "express";
import { sequelize } from "../data-access/sequelize";
import { expressLoader } from "./express";
import { databaseLoader } from "./database";

export const initialization = async ({ service }: { service: Application }): Promise<void> => {
    console.log(`
    ---------------------------------------
    \tService initialization started
    ---------------------------------------
    `);

    expressLoader({ service });
    await databaseLoader({ sequelize });

    console.log(`
    ---------------------------------------
    \tService initialization completed
    ---------------------------------------
    `);
};
