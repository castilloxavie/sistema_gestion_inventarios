import { DataTypes } from "sequelize"
import { sequelize } from "../config/databases.js"

export const Sale = sequelize.define(
    "Sale",
    {
        total: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    },
    {timestamps: true}
)
