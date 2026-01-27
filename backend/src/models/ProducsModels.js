import { DataTypes } from "sequelize"

import { sequelize } from "../config/databases.js"

export const Products = sequelize.define(
    "Product",
    {
        nombre:{type: DataTypes.STRING, allowNull: false},
        codigo: {type: DataTypes.STRING, allowNull: false, unique: true},
        categoria: {type: DataTypes.STRING},
        precio: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        stock: {type: DataTypes.INTEGER, defaultValue: 0},
        proveedor_id: {type: DataTypes.INTEGER, allowNull: true},
        estado: {type: DataTypes.INTEGER, defaultValue: 1}  // 1=activo, 0=inactivo
    },
    {
        timestamps: true,
        tableName: "products"
    }
)
