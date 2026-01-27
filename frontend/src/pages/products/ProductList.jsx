import { Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { useDashboard } from "../../auth/DashboardContext";
import Modal from "../../components/Modal.jsx";
import { deleteProduct, getProducts } from "../../services/productServices.js";

import "../../styles/produc.css";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchDashboardData } = useDashboard();

    const loadProducts = async (searchTerm = "") => {
        try {
            const data = await getProducts(searchTerm ? { search: searchTerm } : {});
            setProducts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleSearch = async () => {
        if (!search.trim()) {
            setSearchResults([]);
            setIsModalOpen(false);
            return;
        }

        try {
            const results = await getProducts({ search });
            setSearchResults(results);
            setIsModalOpen(true);
            setSearch(""); // Limpiar el input después de la búsqueda exitosa
        } catch (error) {
            console.error("Error al buscar productos:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    if (loading) return (
        <div className="loading-container">
            <p>Cargando Productos...</p>
        </div>
    );

    const isAdmin = user?.rol === "admin";

    return (
        <div className="products-container">
            <div className="products-header">
                <h2>Productos</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    {isAdmin && (
                        <button className="btn btn-primary" onClick={() => navigate("/products/new")}>
                            Nuevo Producto
                        </button>
                    )}
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    <Search size={20} />
                    Buscar
                </button>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.codigo}</td>
                                <td>${p.precio}</td>
                                <td>{p.stock}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                navigate(`/products/${p.id}`)
                                            }
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={async () => {
                                                if (!confirm("¿Estás seguro de eliminar este producto?")) {
                                                    return;
                                                }
                                                try {
                                                    await deleteProduct(p.id);
                                                    await loadProducts(); // Recargar la lista de productos
                                                    await fetchDashboardData(); // Recargar los datos del dashboard
                                                } catch (error) {
                                                    console.error("Error al eliminar el producto:", error);
                                                }
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para resultados de búsqueda */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Resultado de Búsqueda - ${searchResults.length} producto(s) encontrado(s)`}
            >
                {searchResults.length > 0 ? (
                    <div className="search-results">
                        {searchResults.map((product) => (
                            <div key={product.id} className="product-detail">
                                <h4>{product.nombre}</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <p><strong>Código:</strong> {product.codigo}</p>
                                    <p><strong>Precio:</strong> ${product.precio}</p>
                                    <p><strong>Stock:</strong> {product.stock}</p>
                                    <p><strong>Categoría:</strong> {product.categoria || 'N/A'}</p>
                                </div>
                                <p><strong>Estado:</strong> {product.estado === 1 ? 'Activo' : 'Inactivo'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                        No se encontraron productos que coincidan con la búsqueda "{search}".
                    </p>
                )}
            </Modal>
        </div>
    );
}
