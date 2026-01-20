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
                        {p.name}
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

            <input
                type="number"
                step="0.01"
                value={item.price}
                onChange={(e) =>
                    onChange(item.id, "price", e.target.value)
                }
            />

            <button onClick={() => onRemove(item.id)}>✕</button>
        </div>
    );
}
