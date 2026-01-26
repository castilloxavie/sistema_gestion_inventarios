import { DataTypes } from "sequelize"

import { sequelize } from "../config/databases.js"

export const Sale = sequelize.define(
    "Sale",
    {
        subtotal: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        iva: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        total: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        metodo_pago: {
            type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia", "otro"),
            defaultValue: "efectivo"
        },
        cliente_id: { type: DataTypes.INTEGER, allowNull: true } // Puede ser venta anónima
    },
    {timestamps: true}
)
