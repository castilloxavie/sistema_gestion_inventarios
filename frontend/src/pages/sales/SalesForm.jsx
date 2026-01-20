import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import SaleItemRow from "../../components/sales/SalesItemRow";
import { getProducts } from "../../services/productServices";
import { createSales } from "../../services/salesServices";

import "../../styles/sales.css"

export default function SalesForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [items, setItems] = useState([
        { id: crypto.randomUUID(), product_id: "", quantity: 1, price: 0 },
    ]);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const updateItem = (id, field, value) => {
        setItems(items.map(i =>
            i.id === id ? { ...i, [field]: value } : i
        ));
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const addItem = () => {
        setItems([
            ...items,
            { id: crypto.randomUUID(), product_id: "", quantity: 1, price: 0 }
        ]);
    };

    const total = items.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validaciones
        if (!user) {
            setError("Usuario no autenticado");
            return;
        }
        if (items.length === 0) {
            setError("Debe agregar al menos un producto");
            return;
        }
        for (const item of items) {
            if (!item.product_id || item.quantity <= 0) {
                setError("Todos los productos deben tener cantidad positiva y estar seleccionados");
                return;
            }
        }

        try {
            const payload = {
                usuario_id: user.id,
                items: items.map(i => ({ producto_id: i.product_id, cantidad: i.quantity }))
            };
            await createSales(payload);
            setSuccess("Venta registrada exitosamente");
            setTimeout(() => navigate("/sales"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Error al registrar la venta");
        }
    };

    return (
        <div className="sales-form">
            <div className="pos-header">
                <h2>Nueva Venta</h2>
                <div className="pos-info">
                    <span>Fecha: {new Date().toLocaleDateString()}</span>
                    <span>Hora: {new Date().toLocaleTimeString()}</span>
                    <span>Vendedor: {user?.nombre || 'Usuario'}</span>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="pos-layout">
                <div className="pos-items-section">
                    <div className="items-header">
                        <h3>Productos</h3>
                        <button type="button" className="btn-add" onClick={addItem}>
                            + Agregar Producto
                        </button>
                    </div>

                    <div className="items-list">
                        {items.map((item) => (
                            <SaleItemRow
                                key={item.id}
                                item={item}
                                products={products}
                                onChange={updateItem}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>
                </div>

                <div className="pos-checkout-section">
                    <div className="checkout-card">
                        <h3>Resumen de Venta</h3>

                        <div className="checkout-total">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="total-row final-total">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="checkout-actions">
                            <button type="submit" className="btn-submit">
                                Registrar Venta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

