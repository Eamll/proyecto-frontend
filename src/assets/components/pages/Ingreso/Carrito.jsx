import React from "react";

export const Carrito = ({ catalogo, onAddToCart }) => {
    const handleAddToCart = () => {
        onAddToCart(catalogo);
    };

    return (
        <div className="carrito-item">
            <h4>{catalogo.nombre}</h4>
            <h4>{catalogo.codigo_interno}</h4>
            <button className="boton_cart_item" onClick={handleAddToCart}>Agregar al Carrito</button>
        </div>
    );
};
