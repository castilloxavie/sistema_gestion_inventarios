import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInventoryMovements } from "../../services/inventoryServices";

import "../../styles/inventory.css"

export default function InventoryList() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getInventoryMovements()
            .then(setMovements)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-container"><p>Cargando inventario...</p></div>;

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h2>Movimientos de Inventario</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/inventory/new")}>
                        Registrar movimiento
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((m) => (
                            <tr key={m.id}>
                                <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Fecha inválida"}</td>
                                <td>{m.Product?.nombre || "N/A"}</td>
                                <td className={`tipo-${m.tipo?.toLowerCase() || ""}`}>
                                    {m.tipo || "N/A"}
                                </td>
                                <td>{m.cantidad || 0}</td>
                                <td>{m.Provider?.nombre || m.Product?.Provider?.nombre || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}