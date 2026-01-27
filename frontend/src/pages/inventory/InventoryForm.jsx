import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDashboard } from "../../auth/DashboardContext";
import Modal from "../../components/Modal";
import { createInventoryMovement } from "../../services/inventoryServices";
import { getProducts } from "../../services/productServices";
import { getProviders } from "../../services/providersServices";

import "../../styles/inventory.css";

export default function InventoryForm() {
    const navigate = useNavigate();
    const { fetchDashboardData } = useDashboard();

    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        message: "",
    });

    const [form, setForm] = useState({
        product_id: "",
        provider_id: "",
        type: "OUT",
        quantity: 1,
    });

    useEffect(() => {
        getProducts().then(setProducts);
        getProviders().then(setProviders);
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createInventoryMovement(form);
            await fetchDashboardData(); // Recargar datos del dashboard
            navigate("/inventory");
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (errorMessage.includes("Stock insuficiente")) {
                setModalState({
                    isOpen: true,
                    title: "Error de Stock",
                    message: "No hay suficiente stock del producto seleccionado para registrar la salida.",
                });
            } else {
                setModalState({
                    isOpen: true,
                    title: "Error Inesperado",
                    message: "No se pudo registrar el movimiento. Por favor, verifique que todos los campos estén correctos e inténtelo de nuevo.",
                });
            }
        }
    };

    const closeModal = () => {
        setModalState({ isOpen: false, title: "", message: "" });
    };

    return (
        <div className="form-container">
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
            >
                <p>{modalState.message}</p>
            </Modal>

            <div className="form-header">
                <h2>Registrar movimiento</h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/inventory")}
                >
                    Volver a Inventarios
                </button>
            </div>

            <form onSubmit={handleSubmit} className="inventory-form">
                <select
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione un Producto</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} (Stock: {p.stock})
                        </option>
                    ))}
                </select>

                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="IN">Entrada</option>
                    <option value="OUT">Salida</option>
                </select>

                {form.type === "IN" && (
                    <select
                        name="provider_id"
                        value={form.provider_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un Proveedor</option>
                        {providers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                )}
                
                <label htmlFor="quantity">Cantidad:</label>
                <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    placeholder="Cantidad"
                />

                <button type="submit" className="btn btn-primary">
                    Registrar
                </button>
            </form>
        </div>
    );
}