import { useRef, useState } from "react";

export default function SaleItemRow({
    item,
    products,
    onChange,
    onRemove
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const inputRef = useRef(null);

    // Get selected product name for display
    const selectedProduct = products.find(p => p.id === item.product_id);
    const displaySearchTerm = selectedProduct ? selectedProduct.nombre : searchTerm;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredProducts([]);
            setShowDropdown(false);
        } else {
            const filtered = products.filter(p =>
                p.nombre.toLowerCase().includes(value.toLowerCase()) ||
                p.codigo.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowDropdown(true);
        }
    };

    const handleProductSelect = (product) => {
        onChange(item.id, "product_id", product.id);
        setSearchTerm(product.nombre);
        setShowDropdown(false);
        inputRef.current.blur();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && filteredProducts.length > 0) {
            handleProductSelect(filteredProducts[0]);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
            inputRef.current.blur();
        }
    };

    const handleInputFocus = () => {
        if (searchTerm && !showDropdown) {
            const filtered = products.filter(p =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowDropdown(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding to allow click on dropdown items
        setTimeout(() => setShowDropdown(false), 150);
    };

    return (
        <div className="sale-item-row">
            <div className="product-search-container">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar producto..."
                    value={displaySearchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="product-search-input"
                />
                {showDropdown && filteredProducts.length > 0 && (
                    <div className="product-dropdown">
                        {filteredProducts.slice(0, 10).map((product) => (
                            <div
                                key={product.id}
                                className="product-dropdown-item"
                                onClick={() => handleProductSelect(product)}
                            >
                                <div className="product-info">
                                    <span className="product-name">{product.nombre}</span>
                                    <span className="product-code">({product.codigo})</span>
                                </div>
                                <span className="product-price">${parseFloat(product.precio).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
