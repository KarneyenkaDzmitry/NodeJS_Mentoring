import { Model, DataTypes, Op } from "sequelize";
import { sequelize } from "../sequelize";
import { TGroup } from "../../types/group.type";

class Group extends Model {
    public static findGroup(id: string): Promise<Group | null> {
        return this.findOne({
            where: { id },
        });
    }

    public static findGroupByName(name: string): Promise<Group | null> {
        return this.findOne({ where: { name } });
    }

    public static findGroups(limit: number): Promise<Group[]> {
        return this.findAll(limit > 0 ? { limit } : {});
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
        return this.findOrCreate({ where: { name: group.name }, defaults: { ...group } });
    }
    public static async updateGroup(group: TGroup): Promise<[number, Group[]]> {
        return this.update({ ...group }, { where: { id: group.id }, returning: true });
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
        permissions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isValidPermission: (permissions: string[]): boolean => {
                    return permissions.every((permission) => /^(READ|WRITE|DELETE|SHARE|UPLOAD_FILES)$/.test(permission));
                },
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
