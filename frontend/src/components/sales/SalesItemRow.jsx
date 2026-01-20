export default function SaleItemRow({
    item,
    products,
    onChange,
    onRemove
}) {
    return (
        <div className="sale-item-row">
            <select
                value={item.product_id}
                onChange={(e) =>
                    onChange(item.id, "product_id", e.target.value)
                }
            >
                <option value="">Producto</option>
                {products.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nombre}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                    onChange(item.id, "quantity", e.target.value)
                }
            />

            <div className="unit-price">
                <span>Precio U.</span>
                <span>${parseFloat(item.price).toFixed(2)}</span>
            </div>

            <button onClick={() => onRemove(item.id)}>✕</button>
        </div>
    );
}
