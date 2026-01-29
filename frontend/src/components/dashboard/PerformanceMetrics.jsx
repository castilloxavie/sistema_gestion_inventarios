import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import api from '../../api/axios';

export default function PerformanceMetrics({ data }) {
    const [metrics, setMetrics] = useState({
        weeklySales: 0,
        monthlySales: 0,
        weeklyGoal: 1000000, // Default goal
        monthlyGoal: 4000000,
        weeklyProgress: 0,
        monthlyProgress: 0
    });

    useEffect(() => {
        fetchPerformanceMetrics();
    }, []);

    const fetchPerformanceMetrics = async () => {
        try {
            // Get sales data for current week and month
            const response = await api.get('/sales');
            const sales = response.data;

            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const weeklySales = sales
                .filter(sale => new Date(sale.createdAt) >= startOfWeek)
                .reduce((sum, sale) => sum + parseFloat(sale.total), 0);

            const monthlySales = sales
                .filter(sale => new Date(sale.createdAt) >= startOfMonth)
                .reduce((sum, sale) => sum + parseFloat(sale.total), 0);

            setMetrics(prev => ({
                ...prev,
                weeklySales,
                monthlySales,
                weeklyProgress: (weeklySales / prev.weeklyGoal) * 100,
                monthlyProgress: (monthlySales / prev.monthlyGoal) * 100
            }));
        } catch (error) {
            console.error('Error fetching performance metrics:', error);
        }
    };

    useEffect(() => {
        fetchPerformanceMetrics();
    }, []);

    const ProgressBar = ({ progress, label }) => (
        <div className="progress-bar-container">
            <div className="progress-bar-label">{label}</div>
            <div className="progress-bar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>
            <div className="progress-bar-text">{progress.toFixed(1)}%</div>
        </div>
    );

    return (
        <div className="performance-metrics">
            <div className="metrics-header">
                <h3 className="metrics-title">
                    <TrendingUp size={20} />
                    Rendimiento de Ventas
                </h3>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon weekly">
                        <Calendar size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Ventas Semanales</div>
                        <div className="metric-value">${metrics.weeklySales.toLocaleString()}</div>
                        <div className="metric-goal">Meta: ${metrics.weeklyGoal.toLocaleString()}</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon monthly">
                        <DollarSign size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Ventas Mensuales</div>
                        <div className="metric-value">${metrics.monthlySales.toLocaleString()}</div>
                        <div className="metric-goal">Meta: ${metrics.monthlyGoal.toLocaleString()}</div>
                    </div>
                </div>

                <div className="metric-card full-width">
                    <div className="metric-icon goal">
                        <Target size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Progreso de Metas</div>
                        <div className="progress-bars">
                            <ProgressBar progress={metrics.weeklyProgress} label="Semanal" />
                            <ProgressBar progress={metrics.monthlyProgress} label="Mensual" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
