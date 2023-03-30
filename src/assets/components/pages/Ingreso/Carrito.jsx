import React from "react";

export const Carrito = ({ catalogo, onAddToCart }) => {
    const handleAddToCart = () => {
        onAddToCart(catalogo);
    };

    return (
        <div className="carrito-item">
            <h4>{catalogo.nombre}</h4>
            <button onClick={handleAddToCart}>Agregar al Carrito</button>
        </div>
    );
};
