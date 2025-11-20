import {DataTypes} from "sequelize"
import { sequelize } from "../config/databases.js"


export const User = sequelize.define("User", {
    nombre: {type: DataTypes.STRING, allowNull: false},
    apellido: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true, validate: {isEmail: true}},
    password: {type: DataTypes.STRING, allowNull: false},
    rol: {type: DataTypes.ENUM("admin", "vendedor", "auditoria"),defaultValue:"vendedor"}
},
{timestamps: true}
)