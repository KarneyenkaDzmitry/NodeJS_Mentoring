import { Model, DataTypes, Op, BelongsToManyOptions } from "sequelize";
import { sequelize } from "../sequelize";
import { Group } from "./groups";
import { User } from "./users";

class UserGroup extends Model {
    public static async addUsersToGroup(groupId: string, userIds: string[]): Promise<number> {
        const FAILURE_RESPONSE = -1;
        const transaction = await sequelize.transaction();
        try {
            const result = await Promise.all(
                userIds.map((userId: string) => this.create({ group_id: groupId, user_id: userId }, { transaction })),
            );
            transaction.commit();
            return result.length;
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return FAILURE_RESPONSE;
        }
    }
}

UserGroup.init(
    {
        group_id: {
            type: DataTypes.UUIDV4,
            references: {
                model: Group,
                key: "id",
            },
        },
        user_id: {
            type: DataTypes.UUIDV4,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "user_groups",
        modelName: "user_group",
        timestamps: false,
    },
);

Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
} as BelongsToManyOptions);

User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: "user_id",
    onDelete: "CASCADE",
} as BelongsToManyOptions);

// UserGroup.sync();
export { UserGroup };
