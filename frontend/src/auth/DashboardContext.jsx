import React, { createContext, useContext, useEffect, useState } from 'react';

import api from '../api/axios';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const useDashboard = () => {
    return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Determinar qué endpoint llamar según el rol
            const endpoint = user?.rol === 'admin' ? '/dashboard' : '/dashboard/seller';
            const response = await api.get(endpoint);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Mantener datos antiguos si la recarga falla, o establecerlos en nulos
            // setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Refetch data when user changes
    useEffect(() => {
        if (user) {
            fetchDashboardData();
        } else {
            setData(null);
            setLoading(false);
        }
    }, [user]);

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
