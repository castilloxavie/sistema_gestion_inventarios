import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSaleById } from "../../services/salesServices";

import "../../styles/sales.css";

export default function SalesDetail() {
    const { id } = useParams();
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
            <h2>Detalle de Venta #{sale.id}</h2>
            <p><strong>Total:</strong> ${sale.total}</p>
            <p><strong>Fecha:</strong> {new Date(sale.createdAt).toLocaleString()}</p>
            <h3>Items:</h3>
            <ul>
                {sale.SaleItems.map(item => (
                    <li key={item.id}>
                        {item.Product.nombre} - Cantidad: {item.cantidad} - Precio Unitario: ${item.precio_unitario}
                    </li>
                ))}
            </ul>
        </div>
    );
}
