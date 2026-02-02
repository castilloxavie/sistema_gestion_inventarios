import { body } from "express-validator";

import { validateResult } from "../../middlewares/validatorManager.js";

export const validateSaleCreate = [
    body("items")
        .isArray({ min: 1 }).withMessage("La venta debe tener al menos un producto")
        .custom((items) => {
            for (const item of items) {
                if (!item.producto_id || !item.cantidad) {
                    throw new Error("Cada item debe tener producto_id y cantidad");
                }
                if (item.cantidad <= 0) {
                    throw new Error("La cantidad de cada producto debe ser mayor a 0");
                }
            }
            return true;
        }),
    
    body("metodo_pago")
        .optional()
        .isIn(["efectivo", "tarjeta", "transferencia", "otro"]).withMessage("Método de pago no válido"),
    
    body("cliente_id")
        .optional()
        .custom((value) => {
            if (value === null || value === undefined || value === '') return true;
            if (typeof value === 'number' && Number.isInteger(value)) return true;
            throw new Error("El ID del cliente debe ser un número entero");
        }),

    validateResult
];
