import { DataTypes } from "sequelize";

import { sequelize } from "../config/databases.js";

export const Client = sequelize.define(
    "Client",
    {
        nombre: { type: DataTypes.STRING, allowNull: false },
        apellido: { type: DataTypes.STRING, allowNull: true },
        documento: { type: DataTypes.STRING, allowNull: true, unique: true }, // DNI, NIT, etc.
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail(value) {
                    if (value && value.trim() !== '') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            throw new Error('Formato de email inválido');
                        }
                    }
                }
            }
        },
        telefono: { type: DataTypes.STRING, allowNull: true },
        direccion: { type: DataTypes.STRING, allowNull: true }
    },
    {
        timestamps: true,
        tableName: "clients"
    }
);
