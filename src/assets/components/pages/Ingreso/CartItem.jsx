// CartItem.js
import React from "react";

export const CartItem = ({ catalogo, updateCartItem }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateCartItem(catalogo.id, name, value);
    };

    return (
        <div className="cart-item">
            <h4>{catalogo.nombre}</h4>
            <label htmlFor="cantidad">Cantidad:</label>
            <input
                type="number"
                name="cantidad"
                value={catalogo.cantidad || ""}
                onChange={handleInputChange}
                required
            />
            <br />

            <label htmlFor="costo_unitario">Costo Unitario:</label>
            <input
                type="number"
                name="costo_unitario"
                value={catalogo.costo_unitario || ""}
                onChange={handleInputChange}
                required
            />
            <br />
        </div>
    );
};
