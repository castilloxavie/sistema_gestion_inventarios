import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Products from "../pages/Products"
import Providers from "../pages/Providers"
import Inventory from "../pages/Inventory"
import Sales from "../pages/Sales"
import ProtectedRouter from "../auth/ProtectedRoute"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRouter> <Dashboard /> </ProtectedRouter>} />
                <Route path="/products" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Products /> </ProtectedRouter>} />
                <Route path="/providers" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Providers /> </ProtectedRouter>} />
                <Route path="/inventory" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Inventory /> </ProtectedRouter>} />
                <Route path="/sales" element = {<ProtectedRouter role={["admin", "vendedor"]}> <Sales /> </ProtectedRouter>} />
            </Routes>
        </BrowserRouter>
    )
}