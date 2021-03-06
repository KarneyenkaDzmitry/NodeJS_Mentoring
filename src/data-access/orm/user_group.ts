import { Model, DataTypes, BelongsToManyOptions } from "sequelize";
import { Transaction } from "../../types/user_group.type";
import { sequelize } from "../sequelize";
import { Group } from "./groups";
import { User } from "./users";

class UserGroup extends Model {
    public static async addUsersToGroup(groupId: string, userIds: string[]): Promise<Transaction> {
        const FAILURE_RESPONSE = -1;
        const transaction = await sequelize.transaction();
        try {
            const result = await Promise.all(
                userIds.map((userId: string) => this.create({ group_id: groupId, user_id: userId }, { transaction })),
            );
            transaction.commit();
            return { number: result.length, message: "Succeed" };
        } catch (error: any) {
            await transaction.rollback();
            return { number: FAILURE_RESPONSE, message: error.parent.detail };
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

export { UserGroup };
