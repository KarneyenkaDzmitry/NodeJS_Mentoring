import { Model, DataTypes, Op } from "sequelize";
import { TBaseUser, TUser } from "../../types/base.user.type";
import { sequelize } from "../sequelize";

class User extends Model {
    public static findUser(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
    }

    public static findUsers(limit: number): Promise<User[]> {
        return this.findAll(limit > 0 ? { limit } : {});
    }

    public static getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
        return this.findAll({
            limit,
            where: {
                login: {
                    [Op.like]: `%${loginSubstring}%`,
                },
            },
        });
    }
    // return this.getAutoSuggestUsers(loginSubstring, limit);

    public static async createUser(user: TBaseUser): Promise<[User, boolean]> {
        return this.findOrCreate({ where: { login: user.login }, defaults: { ...user } });
    }

    public static async updateUser(user: TUser): Promise<[number, User[]]> {
        return this.update({ ...user }, { where: { id: user.id, login: user.login }, returning: true });
    }

    public static async deleteUser(id: string, soft: boolean): Promise<[number, User[]]> {
        if (soft) {
            return Promise.resolve([await this.destroy({ where: { id } }), []]);
        } else {
            return this.update({ isDeleted: true }, { where: { id }, returning: true });
        }
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        login: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [3, 25],
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [5, 35],
            },
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 130,
                min: 4,
            },
        },
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        tableName: "users",
        modelName: "usr",
        timestamps: false,
        paranoid: true,
        deletedAt: "isDeleted",
    },
);

export { User };
