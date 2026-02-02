import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSale } from "../../services/salesServices";

import "../../styles/sales.css"

export default function SalesList() {
    const [sales, setSales] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSales(page);
    }, [page]);

    const fetchSales = async (currentPage) => {
        setLoading(true);
        try {
            const data = await getSale(currentPage, 20);
            console.log('Sales data:', data);
            if (Array.isArray(data)) {
                setSales(data);
                setPagination({ totalPages: 1, page: 1, total: data.length });
            } else {
                setSales(data.data || []);
                setPagination(data.pagination || {});
            }
        } catch (err) {
            console.error('Error fetching sales:', err);
            setError(err.response?.data?.error || "Error al cargar ventas");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (loading) return <p>Cargando ventas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="sales-container">
            <div className="sales-header">
                <h2>Ventas</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/sales/new")}>
                        Nueva venta
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Ítems</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                                <td>${parseFloat(s.total).toFixed(2)}</td>
                                <td>{s.SaleItems.length}</td>
                                <td>
                                    <button className="btn btn-secondary" onClick={() => navigate(`/sales/${s.id}`)}>
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {page} de {pagination.totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pagination.totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
