import { Activity, AlertTriangle, Bell, DollarSign, FileText, Package, PlusCircle, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useAuth } from '../auth/AuthContext';
import { useDashboard } from '../auth/DashboardContext';
import Layout from '../components/layout/Layout';
import Modal from '../components/Modal';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import ClientManagement from '../components/dashboard/ClientManagement';
import SellerTools from '../components/dashboard/SellerTools';
import api from '../api/axios';

import '../styles/Dashboard.css';
import '../styles/PerformanceMetrics.css';
import '../styles/ClientManagement.css';
import '../styles/SellerTools.css';

export default function Dashboard() {
    const { dashboardData, loading, fetchDashboardData } = useDashboard();
    const { user } = useAuth();

    useEffect(() => {
        // Solo busca datos si aún no se han cargado
        if (!dashboardData) {
            fetchDashboardData();
        }
    }, [dashboardData, fetchDashboardData]);

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">Cargando dashboard...</div>
            </Layout>
        );
    }

    if (!dashboardData) return null;

    // Renderizado condicional según rol
    if (user?.rol !== 'admin') {
        return <SellerDashboard data={dashboardData} />;
    }

    return <AdminDashboard data={dashboardData} />;
}

function SellerDashboard({ data }) {
    const { today, recentSales, lowStockProducts } = data;
    const [showLowStockModal, setShowLowStockModal] = useState(false);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mostrar modal si hay productos con stock bajo al cargar el dashboard
        if (lowStockProducts && lowStockProducts.length > 0) {
            setShowLowStockModal(true);
        }
    }, [lowStockProducts]);

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales');
            console.log('Sales fetched:', response.data);
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const openPDFModal = async () => {
        console.log('Opening PDF modal');
        await fetchSales();
        setShowPDFModal(true);
    };

    const openPDF = async (saleId) => {
        try {
            const response = await api.get(`/sales/${saleId}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factura-${saleId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error al descargar el PDF');
        }
    };

    const viewSaleDetails = async (saleId) => {
        try {
            const response = await api.get(`/sales/${saleId}`);
            setSelectedSale(response.data);
            setShowSaleDetailsModal(true);
        } catch (error) {
            console.error('Error fetching sale details:', error);
            alert('Error al obtener los detalles de la venta');
        }
    };

    // Filtrar ventas basándose en el término de búsqueda
    const filteredSales = sales.filter((sale) => {
        if (!searchTerm) return true;
        const clientName = sale.Client ? `${sale.Client.nombre} ${sale.Client.apellido}`.toLowerCase() : 'anónimo';
        const clientDoc = sale.Client ? sale.Client.documento.toLowerCase() : '';
        const searchLower = searchTerm.toLowerCase();
        return clientName.includes(searchLower) || clientDoc.includes(searchLower);
    });

    return (
        <Layout>
            <Modal
                isOpen={showLowStockModal}
                onClose={() => setShowLowStockModal(false)}
                title="Alerta de Stock Bajo"
            >
                <p>Los siguientes productos tienen un stock inferior a 10 unidades:</p>
                <ul>
                    {lowStockProducts.map((product) => (
                        <li key={product.id}>
                            <strong>{product.nombre}</strong> - Stock: {product.stock}
                        </li>
                    ))}
                </ul>
            </Modal>
            <Modal
                isOpen={showPDFModal}
                onClose={() => setShowPDFModal(false)}
                title="PDFs de Ventas"
            >
                {console.log('Modal rendering with showPDFModal:', showPDFModal, 'sales:', sales)}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <p>Haz clic en cualquier venta para descargar su factura en PDF:</p>
                <div className="pdf-list">
                    {filteredSales.map((sale) => (
                        <div
                            key={sale.id}
                            className="pdf-item"
                            onClick={() => openPDF(sale.id)}
                        >
                            <div className="pdf-info">
                                <strong>Factura #{sale.id}</strong>
                                <span>
                                    {sale.Client ? `${sale.Client.nombre} ${sale.Client.apellido}` : 'Anónimo'} -
                                    ${parseFloat(sale.total).toLocaleString()} -
                                    {new Date(sale.createdAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filteredSales.length === 0 && searchTerm && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            No se encontraron facturas que coincidan con la búsqueda.
                        </p>
                    )}
                </div>
            </Modal>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Hola, Vendedor</h1>
                    <div className="header-actions">
                        <button onClick={openPDFModal} className="btn btn-primary">
                            <FileText size={20} />
                            PDFs de Ventas
                        </button>
                        <Link to="/sales/new" className="btn-success btn-lg">
                            <PlusCircle size={24} />
                            Nueva Venta (POS)
                        </Link>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatCard 
                        icon={<DollarSign size={24} />} 
                        label="Ventas Hoy" 
                        value={`$${parseFloat(today.amount || 0).toLocaleString()}`} 
                        color="green"
                    />
                    <StatCard 
                        icon={<ShoppingBag size={24} />} 
                        label="Pedidos Hoy" 
                        value={today.count} 
                        color="blue"
                    />
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Mis Ventas Recientes</h3>
                        </div>
                        <div className="table-container">
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td>#{sale.id}</td>
                                            <td>{sale.Client ? `${sale.Client.nombre} ${sale.Client.apellido || ''}` : 'Anónimo'}</td>
                                            <td>${parseFloat(sale.total).toLocaleString()}</td>
                                            <td>{new Date(sale.createdAt).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</td>
                                        </tr>
                                    ))}
                                    {recentSales.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No has realizado ventas hoy</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <AlertTriangle size={20} color="var(--accent-red)" />
                            <h3 className="chart-title" style={{color: 'var(--accent-red)'}}>Alerta Stock Bajo</h3>
                        </div>
                        <div className="table-container">
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.nombre}</td>
                                            <td style={{fontWeight: 'bold', color: 'var(--accent-red)'}}>{product.stock}</td>
                                        </tr>
                                    ))}
                                     {lowStockProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="2" style={{textAlign: 'center', padding: '20px'}}>Todo el stock está bien</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <PerformanceMetrics data={data} />

                    <ClientManagement />

                    <SellerTools />
                </div>
            </div>
        </Layout>
    );
}

function AdminDashboard({ data }) {
    const { totals, charts, lowStockProducts } = data;
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLowStockModal, setShowLowStockModal] = useState(false);

    useEffect(() => {
        // Mostrar modal si hay productos con stock bajo al cargar el dashboard
        if (lowStockProducts && lowStockProducts.length > 0) {
            setShowLowStockModal(true);
        }
    }, [lowStockProducts]);

    // Prepare chart data
    const topProductsData = charts.topProducts.map(item => ({
        name: item.Product?.nombre || 'Desconocido',
        ventas: parseInt(item.total_vendido)
    }));

    // Group sales by date for the chart
    const salesByDate = charts.last7Days.reduce((acc, sale) => {
        const date = new Date(sale.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        acc[date] = (acc[date] || 0) + parseFloat(sale.total);
        return acc;
    }, {});

    const salesTrendData = Object.entries(salesByDate).map(([date, total]) => ({
        date,
        total
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <Layout>
            <Modal
                isOpen={showLowStockModal}
                onClose={() => setShowLowStockModal(false)}
                title="Alerta de Stock Bajo"
            >
                <p>Los siguientes productos tienen un stock inferior a 10 unidades:</p>
                <ul>
                    {lowStockProducts.map((product) => (
                        <li key={product.id}>
                            <strong>{product.nombre}</strong> - Código: {product.codigo} - Stock: {product.stock}
                        </li>
                    ))}
                </ul>
            </Modal>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Panel de Administración</h1>
                    <div className="notification-container">
                        <button
                            className="notification-bell"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={24} />
                            {lowStockProducts && lowStockProducts.length > 0 && (
                                <span className="notification-badge">{lowStockProducts.length}</span>
                            )}
                        </button>
                        {showNotifications && lowStockProducts && lowStockProducts.length > 0 && (
                            <div className="notification-dropdown">
                                <h4>Productos con Stock Bajo</h4>
                                {lowStockProducts.map((product) => (
                                    <div key={product.id} className="notification-item">
                                        <strong>{product.nombre}</strong><br />
                                        Código: {product.codigo}<br />
                                        Stock: {product.stock}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <StatCard 
                        icon={<DollarSign size={24} />} 
                        label="Ventas Totales" 
                        value={`$${parseFloat(totals.totalSaleAmount || 0).toLocaleString()}`} 
                        color="green"
                    />
                    <StatCard 
                        icon={<ShoppingBag size={24} />} 
                        label="Total Pedidos" 
                        value={totals.totalSaleCount} 
                        color="blue"
                    />
                    <StatCard 
                        icon={<Package size={24} />} 
                        label="Productos" 
                        value={totals.totalProducts} 
                        color="purple"
                    />
                    <StatCard 
                        icon={<Users size={24} />} 
                        label="Proveedores" 
                        value={totals.totalProviders} 
                        color="orange"
                    />
                    <StatCard 
                        icon={<TrendingUp size={24} />} 
                        label="Valor Inventario" 
                        value={`$${parseFloat(totals.inventoryValue || 0).toLocaleString()}`} 
                        color="red"
                    />
                </div>

                {/* Charts Section */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Productos Más Vendidos</h3>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProductsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                                    <YAxis fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                    />
                                    <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Ventas Últimos 7 Días</h3>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart data={salesTrendData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                                    <YAxis fontSize={12} />
                                    <Tooltip 
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#22c55e" 
                                        fillOpacity={1} 
                                        fill="url(#colorTotal)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="recent-activity">
                    <div className="chart-header">
                        <h3 className="chart-title">Últimos Movimientos de Inventario</h3>
                    </div>
                    <div className="table-container">
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charts.lastMovements.map((movement, index) => (
                                    <tr key={index}>
                                        <td>{movement.Product?.nombre || 'Producto eliminado'}</td>
                                        <td>
                                            <span className={`badge ${movement.tipo}`}>
                                                {movement.tipo}
                                            </span>
                                        </td>
                                        <td>{movement.cantidad}</td>
                                        <td>{new Date(movement.createdAt).toLocaleString('es-ES')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );
}

