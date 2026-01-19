import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home } from "lucide-react"

import { deleteProduct, getProducts } from "../../services/productServices.js"

import "../../styles/produc.css"

export default function ProductList () {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data)
        } finally  {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const handleDelete = async (id) => {
        if(!confirm("¿Estás seguro de eliminar este producto?")) {
            return
        }
        await deleteProduct(id)
        loadProducts()
    }

    if(loading) return (
        <div className="loading-container">
            <p>Cargando Productos...</p>
        </div>
    )

    return (
        <div className="products-container">
            <div className="products-header">
                <h2>Productos</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/products/new")}>
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.codigo}</td>
                                <td>${p.precio}</td>
                                <td>{p.stock}</td>
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
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



