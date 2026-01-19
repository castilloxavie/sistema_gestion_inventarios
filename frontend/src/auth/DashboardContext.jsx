import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const DashboardContext = createContext();

export const useDashboard = () => {
    return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard');
            setData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Mantener datos antiguos si la recarga falla, o establecerlos en nulos
            // setData(null); 
        } finally {
            setLoading(false);
        }
    };

    const value = {
        dashboardData: data,
        loading,
        fetchDashboardData
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
