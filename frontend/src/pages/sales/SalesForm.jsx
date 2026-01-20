import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SaleItemRow from "../../components/sales/SalesItemRow";
import { getProducts } from "../../services/productServices";
import { createSales } from "../../services/salesServicves";

import "../../styles/sales.css"

export default function SalesForm() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

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
        await createSales({ items });
        navigate("/sales");
    };

    return (
        <div className="sales-form">
            <h2>Nueva venta</h2>

            <form onSubmit={handleSubmit}>
                {items.map((item) => (
                    <SaleItemRow
                        key={item.id}
                        item={item}
                        products={products}
                        onChange={updateItem}
                        onRemove={removeItem}
                    />
                ))}

                <button type="button" onClick={addItem}>
                    + Agregar producto
                </button>

                <div className="sales-total">
                    Total: ${total.toFixed(2)}
                </div>

                <button type="submit">
                    Registrar venta
                </button>
            </form>
        </div>
    );
}

