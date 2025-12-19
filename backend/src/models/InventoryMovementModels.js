import { DataTypes } from "sequelize";
import { sequelize } from "../config/databases.js";

export const InventoryMovement = sequelize.define(
    "InventoryMovement",
    {
        tipo: {type: DataTypes.ENUM("entrada", "salida"), allowNull: false},
        cantidad: {type: DataTypes.INTEGER, allowNull: false},
        descripcion: { type: DataTypes.STRING}
    },
    {
        timestamps: true,
        tableName: "inventorymovements"
    }
)
