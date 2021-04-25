import { Model, DataTypes, Op } from "sequelize";
import { sequelize } from "../sequelize";
import { TGroup } from "../../types/group.type";
import { Permission } from "./permissions";
import { Groups_Permissions } from "./groups_permissions";

class Group extends Model {
    public static findGroup(id: string): Promise<Group | null> {
        return this.findOne({
            where: { id },
            include: [
                {
                    model: Permission,
                },
            ],
        });
    }

    public static findGroupByName(name: string): Promise<Group | null> {
        return this.findOne({ where: { name }, include: Permission });
    }

    public static findGroups(limit: number): Promise<Group[]> {
        return this.findAll(limit > 0 ? { limit, include: Permission } : { include: Permission });
    }

    public static getAutoSuggestGroups(nameSubstring: string, limit: number): Promise<Group[]> {
        return this.findAll({
            limit,
            where: {
                name: {
                    [Op.like]: `%${nameSubstring}%`,
                },
            },
        });
    }

    public static async createGroup(group: TGroup): Promise<[Group, boolean]> {
        return this.findOrCreate({ where: { name: group.name }, include: Permission, defaults: { ...group } });
    }
    public static async updateGroup(group: TGroup): Promise<[number, Group[]]> {
        return this.update({ ...group }, { where: { id: group.id, name: group.name }, returning: true });
    }
    public static async deleteGroup(id: string): Promise<[number, Group[]]> {
        return Promise.resolve([await this.destroy({ where: { id } }), []]);
    }
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [3, 25],
            },
        },
    },
    {
        sequelize,
        tableName: "groups",
        modelName: "group",
        timestamps: false,
    },
);

export { Group };
