import { Sequelize, Dialect } from "sequelize";
import { configs } from "../config";

const dialect: Dialect = "postgres";

export const sequelize = new Sequelize({ ...configs.db, dialect });
