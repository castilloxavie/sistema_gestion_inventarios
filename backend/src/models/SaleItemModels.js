import { DataTypes } from "sequelize";
import { sequelize } from "../config/databases.js";


export const SaleItem = sequelize.define(
  "SaleItem",
  {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    venta_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  { timestamps: true }
);

