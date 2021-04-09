import { Model, DataTypes } from "sequelize";
import { IUser } from "../../models/interfaces/user.interface";
import { sequelize } from "../sequelize";

class User extends Model {
    //Here could be implemented static and not static methods to manipulate with data of the Object
    public static find(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
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
        // tableName: "users",
        modelName: "user",
        timestamps: false,
    },
);

export { User };
