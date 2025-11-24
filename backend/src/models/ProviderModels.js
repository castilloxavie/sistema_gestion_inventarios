import { DataTypes } from "sequelize";
import { sequelize } from "../config/databases.js";

export const Provider = sequelize.define(
    "Provider",
    {
        nombre: {type: DataTypes.STRING, allowNull: false},
        telefono: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING, allowNull: false, unique: true, validate: {isEmail: true}},
        direccion: {type: DataTypes.STRING},
        estado: {type: DataTypes.INTEGER, defaultValue: 1}  // 1=activo, 0=inactivo
    },
    {timestamps: true}
)
