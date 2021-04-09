import { Application } from "express";
import { sequelize } from "../data-access/sequelize";
import { expressLoader } from "./express";
import { databaseLoader } from "./database";

export const initialization = ({ service }: { service: Application }): void => {
    expressLoader({ service });
    databaseLoader({ sequelize });
};
