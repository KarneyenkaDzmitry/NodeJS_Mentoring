import { Model, DataTypes, Op } from "sequelize";
import { sequelize } from "../sequelize";
import { TGroup } from "../../types/group.type";
import { Group } from "./groups";
import { Permission } from "./permissions";

class Groups_Permissions extends Model {}

Groups_Permissions.init(
    {
        group_id: {
            type: DataTypes.UUIDV4,
            references: {
                model: Group,
                key: "id",
            },
        },
        permission_id: {
            type: DataTypes.CHAR,
            references: {
                model: Permission,
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "groups_permissions",
        timestamps: false,
    },
);
Permission.belongsToMany(Group, { through: "Groups_Permissions" });
Group.belongsToMany(Permission, { through: "Groups_Permissions" });
export { Groups_Permissions };
