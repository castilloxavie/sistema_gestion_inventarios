import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createProduct, getProductById, updateProduct } from "../../services/productServices";

import "../../styles/produc.css"

export default function ProductForm () {
    const {id} = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: "",
        codigo: "",
        precio:"",
        stock: ""
    })

    useEffect(() =>{
        if(id) {
            getProductById(id).then((data) => {
                setForm({
                    ...data,
                    nombre: data.nombre.toUpperCase(),
                    codigo: data.codigo.toUpperCase()
                });
            });
        }
    }, [id])

    const handleChange = (e) => {
        const value = e.target.name === 'nombre' || e.target.name === 'codigo' ? e.target.value.toUpperCase() : e.target.value;
        setForm({
            ...form,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id) {
            await updateProduct(id, form);
        } else {
            await createProduct(form);
        }

        navigate("/products");
    };


    return (
        <div className="product-form">
            <div className="form-header">
                <h2>{id ? "Editar producto" : "Nuevo producto"}</h2>
                <button className="btn btn-dashboard" onClick={() => navigate("/dashboard")}>
                    <Home size={20} />
                    Dashboard
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


