import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDashboard } from "../../auth/DashboardContext";
import { createProduct, getProductById, updateProduct } from "../../services/productServices";
import { getProviders } from "../../services/providersServices";

import "../../styles/produc.css";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchDashboardData } = useDashboard();
    
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        codigo: "",
        precio: "",
        stock: "",
        categoria: "",
        proveedor_id: ""
    });

    useEffect(() => {
        // Fetch providers when component mounts
        getProviders()
            .then(data => setProviders(data.data || []))
            .catch(error => console.error("Error fetching providers:", error));

        if (id) {
            getProductById(id).then((data) => {
                setForm({
                    ...data,
                    nombre: data.nombre.toUpperCase(),
                    codigo: data.codigo.toUpperCase(),
                    // Ensure proveedor_id is not null/undefined for the select
                    proveedor_id: data.proveedor_id || "" 
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const processedValue = name === 'nombre' || name === 'codigo' ? value.toUpperCase() : value;
        setForm({
            ...form,
            [name]: processedValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure empty string is sent as null if no provider is selected
        const payload = {
            ...form,
            proveedor_id: form.proveedor_id || null
        };

        // Remove categoria if it's empty to avoid validation issues
        if (!payload.categoria.trim()) {
            delete payload.categoria;
        }

        try {
            if (id) {
                await updateProduct(id, payload);
            } else {
                await createProduct(payload);
            }
            
            // Recargar los datos del dashboard
            await fetchDashboardData();
            
            navigate("/products");
        } catch (error) {
            console.error("Error al guardar el producto:", error)
            // Opcional: mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className="product-form">
            <div className="form-header">
                <h2>{id ? "Editar producto" : "Nuevo producto"}</h2>
                <button className="btn btn-dashboard" onClick={() => navigate("/products")}>
                    Volver a Productos
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Producto</label>
                    <input
                        id="nombre"
                        name="nombre"
                        placeholder="Ingrese el nombre del producto"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="codigo">Código del Producto</label>
                    <input
                        id="codigo"
                        name="codigo"
                        placeholder="Ingrese el código del producto"
                        value={form.codigo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <input
                        id="categoria"
                        name="categoria"
                        placeholder="Ingrese la categoría"
                        value={form.categoria}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="proveedor_id">Proveedor</label>
                    <select
                        id="proveedor_id"
                        name="proveedor_id"
                        value={form.proveedor_id}
                        onChange={handleChange}
                    >
                        <option value="">-- Seleccione un Proveedor --</option>
                        {providers.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="precio">Precio</label>
                    <input
                        id="precio"
                        name="precio"
                        type="number"
                        step="0.01"
                        placeholder="Ingrese el precio"
                        value={form.precio}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        placeholder="Ingrese la cantidad en stock"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn-submit">
                    {id ? "Actualizar Producto" : "Crear Producto"}
                </button>
            </form>
        </div>
    );
}
