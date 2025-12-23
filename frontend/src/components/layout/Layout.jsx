import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
