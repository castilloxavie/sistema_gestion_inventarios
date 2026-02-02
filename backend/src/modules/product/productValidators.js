import { body } from "express-validator";

import { validateResult } from "../../middlewares/validatorManager.js";

export const validateProductCreate = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    
    body("codigo")
        .trim()
        .notEmpty().withMessage("El código es obligatorio")
        .matches(/^[a-zA-Z0-9\-]+$/).withMessage("El código solo puede contener letras, números y guiones"),
    
    body("precio")
        .notEmpty().withMessage("El precio es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
    
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("El stock debe ser un número entero mayor o igual a 0"),
    
    body("categoria")
        .optional()
        .trim(),

    validateResult
];

export const validateProductUpdate = [
    body("nombre")
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    
    body("precio")
        .optional()
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
    
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("El stock debe ser un número entero mayor o igual a 0"),

    validateResult
];
