import { InventoryMovement } from "./InventoryMovementModels.js"
import { Products } from "./ProducsModels.js"
import { Provider } from "./ProviderModels.js"
import { SaleItem } from "./SaleItemModels.js"
import { Sale } from "./SaleModels.js"
import { User } from "./UserModels.js"

//!relaciones de las tablas 

//Provider 1:N Products
Provider.hasMany(Products, {foreignKey: "proveedor_id"})
Products.belongsTo(Provider, {foreignKey: "proveedor_id"})

//Products 1:N InventoryMovement
Products.hasMany(InventoryMovement, {foreignKey: "producto_id"})
InventoryMovement.belongsTo(Products, {foreignKey: "producto_id"})
InventoryMovement.belongsTo(Provider, {foreignKey: "provider_id"})

//User 1:N InventoryMovement
User.hasMany(InventoryMovement, {foreignKey: "usuario_id"})
InventoryMovement.belongsTo(User, {foreignKey: "usuario_id"})

//User 1:N Sale
User.hasMany(Sale, {foreignKey: "usuario_id"})
Sale.belongsTo(User, {foreignKey: "usuario_id"})

//Products 1:N SaleItem
Products.hasMany(SaleItem, {foreignKey: "producto_id"})
SaleItem.belongsTo(Products, {foreignKey: "producto_id"})

//Sale 1:N SaleItem
Sale.hasMany(SaleItem, {foreignKey: "venta_id"})
SaleItem.belongsTo(Sale, {foreignKey: "venta_id"})


export default {
    User,
    Provider,
    Products,
    InventoryMovement,
    Sale,
    SaleItem
}; 
