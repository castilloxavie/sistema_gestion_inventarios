import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteProvider, getProviders } from '../../services/providersServices';

import "../../styles/providers.css"

export default function ProviderList() {
    const [providers, setProviders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const loadProviders = async (currentPage = 1) => {
        try {
            const response = await getProviders(currentPage);
            if (response.data && Array.isArray(response.data)) {
                setProviders(response.data);
                setPagination(response.pagination || {});
            } else if (Array.isArray(response)) {
                setProviders(response);
                setPagination({});
            } else {
                setProviders([]);
            }
        } catch (error) {
            console.error("Error cargando proveedores:", error);
            setProviders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar proveedor?")) return;
        await deleteProvider(id);
        loadProviders(page);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadProviders(newPage);
    };

    if (loading) return <p>Cargando proveedores...</p>;

    return (
        <div className="providers-container">
            <div className="providers-header">
                <h2>Proveedores</h2>
                <div className="header-actions">
                    <button className="btn btn-dashboard" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/providers/new")}>
                        Nuevo Proveedor
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="providers-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {providers.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.telefono}</td>
                                <td>{p.email}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(`/providers/${p.id}`)
                                        }
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Eliminar
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
