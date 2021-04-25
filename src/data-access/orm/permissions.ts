import { Model, DataTypes, Op } from "sequelize";
import { sequelize } from "../sequelize";
import { TGroup } from "../../types/group.type";
import { Groups_Permissions } from "./groups_permissions";
import { Group } from "./groups";

class Permission extends Model {}

Permission.init(
    {
        id: {
            type: DataTypes.CHAR,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isIn: [["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"]],
            },
        },
    },
    {
        sequelize,
        tableName: "permissions",
        modelName: "permission",
        timestamps: false,
    },
);

// Permission.belongsToMany(Group, { through: Groups_Permissions });

export { Permission };
