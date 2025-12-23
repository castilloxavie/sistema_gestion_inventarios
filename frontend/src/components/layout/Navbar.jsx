import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import './Layout.css';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-content">
                <h2 className="page-title">Sistema de Gestión</h2>
                <div className="user-info">
                    <div className="user-details">
                        <span className="user-name">{user?.nombre} {user?.apellido}</span>
                        <span className="user-role">{user?.rol}</span>
                    </div>
                    <div className="user-avatar">
                        {user?.nombre?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}
