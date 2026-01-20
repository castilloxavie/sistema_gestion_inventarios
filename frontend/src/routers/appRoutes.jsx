import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import ProtectedRouter from "../auth/ProtectedRoute"
import Dashboard from "../pages/Dashboard"
import InventoryForm from "../pages/inventory/InventoryForm"
import InventoryList from "../pages/inventory/InventoryList"
import Login from "../pages/Login"
import ProductForm from "../pages/products/ProductForm"
import ProductList from "../pages/products/ProductList"
import ProvidersForm from "../pages/providers/ProvidersForm"
import ProvidersList from "../pages/providers/ProvidersList"
import Register from "../pages/Register"
import SalesDetail from "../pages/sales/SalesDetail"
import SalesForm from "../pages/sales/SalesForm"
import SalesList from "../pages/sales/SalesList"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRouter role={["admin"]}> <Dashboard /> </ProtectedRouter>} />
                <Route path="/products" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProductList /> </ProtectedRouter>} />
                <Route path="/products/new" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProductForm /> </ProtectedRouter>} />
                <Route path="/products/:id" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProductForm /> </ProtectedRouter>} />
                <Route path="/providers" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProvidersList /> </ProtectedRouter>} />
                <Route path="/providers/new" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProvidersForm /> </ProtectedRouter>} />
                <Route path="/providers/:id" element = {<ProtectedRouter role={["admin", "vendedor"]}> <ProvidersForm /> </ProtectedRouter>} />
                <Route path="/inventory/new" element = {<ProtectedRouter role={["admin", "vendedor"]}> <InventoryForm /> </ProtectedRouter>} />
                <Route path="/inventory" element = {<ProtectedRouter role={["admin", "vendedor"]}> <InventoryList /> </ProtectedRouter>} />
                <Route path="/sales" element = {<ProtectedRouter role={["admin", "vendedor"]}> <SalesList /> </ProtectedRouter>} />
                <Route path="/sales/new" element = {<ProtectedRouter role={["admin", "vendedor"]}> <SalesForm /> </ProtectedRouter>} />
                <Route path="/sales/:id" element = {<ProtectedRouter role={["admin", "vendedor"]}> <SalesDetail /> </ProtectedRouter>} />
            </Routes>
        </BrowserRouter>
    )
}