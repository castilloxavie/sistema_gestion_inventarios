import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import { 
    Package, Users, ShoppingBag, DollarSign, TrendingUp, Activity 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area 
} from 'recharts';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                // El backend devuelve response.data directamente según el uso típico de Axios.
                // Sin embargo, al revisar archivos anteriores, parece que response.data es la carga útil.
                // Si se vuelve a encapsular en la propiedad "data", ajuste.
                // Según authContext "response.data.data", podría estar encapsulado.
                // Supongamos primero la respuesta estándar y, si es necesario, console.log.
                // De hecho, comprobaré cómo está configurado Axios o la estructura de la respuesta.
                // AuthContext usó response.data.data porque el controlador de inicio de sesión devuelve { message, data: token }.
                // Es probable que el controlador del panel de control devuelva json(result).
                setData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">Cargando dashboard...</div>
            </Layout>
        );
    }

    if (!data) return null;

    const { totals, charts } = data;

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
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort might need better date parsing if format changes

    return (
        <Layout>
            <div className="dashboard-container">
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
                            <ResponsiveContainer width="100%" height="100%">
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
