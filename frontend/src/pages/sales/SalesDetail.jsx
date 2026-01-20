import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getSaleById } from "../../services/salesServices";

import "../../styles/sales.css";

export default function SalesDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const data = await getSaleById(id);
                setSale(data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la venta");
            }
        };
        fetchSale();
    }, [id]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!sale) return <p>Cargando...</p>;

    return (
        <div className="sales-container">
            <div className="sales-detail-card">
                <button className="btn btn-secondary" onClick={() => navigate('/sales')}>
                    ← Volver a Ventas
                </button>
                <h2 className="sales-title">Detalle de Venta #{sale.id}</h2>
                <div className="sales-info">
                    <div className="info-row">
                        <span className="info-label">Vendedor:</span>
                        <span className="info-value">{sale.User?.nombre || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Total:</span>
                        <span className="info-value">${sale.total}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Fecha:</span>
                        <span className="info-value">{new Date(sale.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <h3 className="items-title">Items de la Venta</h3>
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.SaleItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.Product.nombre}</td>
                                <td>{item.cantidad}</td>
                                <td>${item.precio_unitario}</td>
                                <td>${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
