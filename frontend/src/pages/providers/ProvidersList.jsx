import { useState, useEffect } from 'react';
import { getProviders, deleteProvider } from '../../services/providersServices';
import { useNavigate } from 'react-router-dom';
import "../../styles/providers.css"
import { Home } from 'lucide-react';

export default function ProviderList() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadProviders = async () => {
        try {
            const data = await getProviders();
            setProviders(data);
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
        loadProviders();
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
        </div>
    );
}