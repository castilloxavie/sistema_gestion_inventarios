import { Banknote, CreditCard, Landmark, Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import SaleItemRow from "../../components/sales/SalesItemRow";
import { createClient, getClientByDocument } from "../../services/clientServices";
import { getProducts } from "../../services/productServices";
import { createSales } from "../../services/salesServices";

import "../../styles/sales.css"

export default function SalesForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Estados para la venta
    const [paymentMethod, setPaymentMethod] = useState("efectivo");
    const [client, setClient] = useState(null); // Cliente seleccionado
    const [clientSearch, setClientSearch] = useState(""); // Input de búsqueda

    // Estado para modal de crear cliente rápido
    const [showCreateClient, setShowCreateClient] = useState(false);
    const [newClientData, setNewClientData] = useState({
        nombre: "", apellido: "", documento: "", email: ""
    });

    const [items, setItems] = useState([
        { id: crypto.randomUUID(), product_id: "", quantity: 1, price: 0 },
    ]);

    useEffect(() => {
        getProducts()
            .then(data => {
                console.log('Products data:', data);
                setProducts(data.data || data);
            })
            .catch(err => {
                console.error('Error loading products:', err);
                setError('Error al cargar productos: ' + (err.response?.data?.error || err.message));
            });
    }, []);

    // Buscar cliente
    const handleSearchClient = async () => {
        if (!clientSearch) return;
        try {
            const foundClient = await getClientByDocument(clientSearch);
            if (foundClient) {
                setClient(foundClient);
                setError("");
            } else {
                setClient(null);
                // Si no existe, sugerimos crearlo
                if(window.confirm(`El cliente con documento ${clientSearch} no existe. ¿Desea crearlo?`)) {
                    setNewClientData({...newClientData, documento: clientSearch});
                    setShowCreateClient(true);
                }
            }
        } catch (err) {
            setClient(null);
            console.error(err);
        }
    };

    // Crear cliente rápido
    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const created = await createClient(newClientData);
            setClient(created);
            setShowCreateClient(false);
            setSuccess("Cliente creado y asignado correctamente");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Error al crear cliente: " + (err.response?.data?.error || err.message));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(i => {
            if (i.id !== id) return i;

            if (field === "product_id") {
                const productId = parseInt(value, 10);
                const product = products.find(p => p.id === productId);
                return {
                    ...i,
                    product_id: productId,
                    price: product ? product.precio : 0
                };
            }
            return { ...i, [field]: value };
        }));
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

    // Cálculos de totales
    const total = items.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
    );
    // Asumiendo que el precio ya incluye IVA (segun backend anterior)
    // O si queremos mostrar desglose visual:
    const subtotal = total / 1.19;
    const iva = total - subtotal;

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
                items: items.map(i => ({ producto_id: i.product_id, cantidad: i.quantity })),
                metodo_pago: paymentMethod,
                cliente_id: client ? client.id : null
            };
            await createSales(payload);
            setSuccess("Venta registrada exitosamente");

            // Disparar evento para refrescar dashboard
            window.dispatchEvent(new CustomEvent('saleCreated'));

            setTimeout(() => navigate("/sales"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Error al registrar la venta");
        }
    };

    return (
        <div className="sales-form">
            <div className="pos-header">
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/sales')}>
                        ← Volver a Ventas
                    </button>
                    <h2>Nueva Venta (POS)</h2>
                </div>
            </div>

            {/* Sección de Cliente */}
            <div className="card client-section">
                <h3>Datos del Cliente</h3>
                <div className="client-search-container">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Buscar por Documento"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClient()}
                        />
                        <button type="button" className="btn-icon" onClick={handleSearchClient}>
                            <Search size={20} />
                        </button>
                    </div>
                    
                    {client ? (
                        <div className="client-info-card">
                            <span className="client-name">{client.nombre} {client.apellido}</span>
                            <span className="client-doc">Doc: {client.documento}</span>
                            <button className="btn-text-danger" onClick={() => {setClient(null); setClientSearch("");}}>Quitar</button>
                        </div>
                    ) : (
                        <div className="no-client">
                            <span>Venta Anónima</span>
                            <button className="btn-link" onClick={() => setShowCreateClient(true)}>
                                <UserPlus size={16} /> Crear Cliente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear Cliente */}
            {showCreateClient && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nuevo Cliente</h3>
                        <form onSubmit={handleCreateClient}>
                            <div className="form-group">
                                <label>Documento</label>
                                <input required value={newClientData.documento} onChange={e => setNewClientData({...newClientData, documento: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input required value={newClientData.nombre} onChange={e => setNewClientData({...newClientData, nombre: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input value={newClientData.apellido} onChange={e => setNewClientData({...newClientData, apellido: e.target.value})} />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCreateClient(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Cliente</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="pos-layout">
                <div className="products-section card">
                    <div className="section-header">
                        <h3>Productos</h3>
                        <button type="button" className="btn btn-primary" onClick={addItem}>
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

                <div className="summary-section card">
                    <h3>Resumen de Pago</h3>

                    {/* Información del Cliente */}
                    {client ? (
                        <div className="client-summary">
                            <h4>Cliente</h4>
                            <p><strong>{client.nombre} {client.apellido}</strong></p>
                            <p>Cédula: {client.documento}</p>
                        </div>
                    ) : (
                        <div className="client-summary">
                            <p><em>Venta Anónima</em></p>
                        </div>
                    )}

                    {/* Lista de Productos */}
                    <div className="products-summary">
                        <h4>Productos</h4>
                        <div className="products-list">
                            {items.filter(item => item.product_id).map((item, index) => {
                                const product = products.find(p => p.id === item.product_id);
                                return (
                                    <div key={item.id} className="product-item">
                                        <span className="product-name">{product?.nombre || 'Producto desconocido'}</span>
                                        <span className="product-qty">x{item.quantity}</span>
                                        <span className="product-price">${(item.quantity * item.price).toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="payment-methods">
                        <label className={`method-card ${paymentMethod === 'efectivo' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="efectivo" checked={paymentMethod === 'efectivo'} onChange={() => setPaymentMethod('efectivo')} />
                            <Banknote size={24} />
                            <span>Efectivo</span>
                        </label>
                        <label className={`method-card ${paymentMethod === 'tarjeta' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="tarjeta" checked={paymentMethod === 'tarjeta'} onChange={() => setPaymentMethod('tarjeta')} />
                            <CreditCard size={24} />
                            <span>Tarjeta</span>
                        </label>
                        <label className={`method-card ${paymentMethod === 'transferencia' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="transferencia" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                            <Landmark size={24} />
                            <span>Transf.</span>
                        </label>
                    </div>

                    <div className="totals-display">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="total-row">
                            <span>IVA (19%)</span>
                            <span>${iva.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="total-row final">
                            <span>Total a Pagar</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <button type="submit" className="btn btn-success btn-block btn-lg">
                        Confirmar Venta
                    </button>
                </div>
            </form>
        </div>
    );
}

