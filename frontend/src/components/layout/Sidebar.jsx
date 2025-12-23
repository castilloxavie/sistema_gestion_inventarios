import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ClipboardList, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './Layout.css';

export default function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Inventario</h2>
            </div>
            
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/products" className={`nav-item ${isActive('/products') ? 'active' : ''}`}>
                    <Package size={20} />
                    <span>Productos</span>
                </Link>
                <Link to="/providers" className={`nav-item ${isActive('/providers') ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Proveedores</span>
                </Link>
                <Link to="/inventory" className={`nav-item ${isActive('/inventory') ? 'active' : ''}`}>
                    <ClipboardList size={20} />
                    <span>Inventario</span>
                </Link>
                <Link to="/sales" className={`nav-item ${isActive('/sales') ? 'active' : ''}`}>
                    <ShoppingCart size={20} />
                    <span>Ventas</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-button">
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
