import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSale } from "../../services/salesServicves";

import "../../styles/sales.css"

export default function SalesList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getSale()
            .then(setSales)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando ventas...</p>;

    return (
        <div className="sales-container">
            <div className="sales-header">
                <h2>Ventas</h2>
                <button onClick={() => navigate("/sales/new")}>
                    Nueva venta
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Ítems</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((s) => (
                        <tr key={s.id}>
                            <td>{new Date(s.created_at).toLocaleDateString()}</td>
                            <td>${s.total.toFixed(2)}</td>
                            <td>{s.items.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
