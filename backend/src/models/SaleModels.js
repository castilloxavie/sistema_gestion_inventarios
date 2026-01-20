import { DataTypes } from "sequelize"
import { sequelize } from "../config/databases.js"

export const Sale = sequelize.define(
    "Sale",
    {
        subtotal: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        iva: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        total: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    },
    {timestamps: true}
)
