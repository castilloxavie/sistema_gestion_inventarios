import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import ProtectedRouter from "../auth/ProtectedRoute"
import Dashboard from "../pages/Dashboard"
import Inventory from "../pages/Inventory"
import Login from "../pages/Login"
import ProductList from "../pages/products/ProductList"
import ProductForm from "../pages/products/ProductForm"
import Providers from "../pages/Providers"
import Register from "../pages/Register"
import Sales from "../pages/Sales"

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
                <Route path="/providers" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Providers /> </ProtectedRouter>} />
                <Route path="/inventory" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Inventory /> </ProtectedRouter>} />
                <Route path="/sales" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Sales /> </ProtectedRouter>} />
            </Routes>
        </BrowserRouter>
    )
}