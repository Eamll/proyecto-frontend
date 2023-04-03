import React, { useState } from "react";

export const CartItem = ({ catalogo, updateCartItem, handleRemoveFromCart }) => {
    const [edited, setEdited] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateCartItem(catalogo.id, name, value);
        if (name === "costo_unitario") {
            setEdited(true);
        }
    };

    const handleRemoveClick = () => {
        handleRemoveFromCart(catalogo);
    };

    const disableInputs = catalogo.costo_unitario !== undefined && !edited;

    return (
        <div className="cart-item">
            <div><h4>{catalogo.nombre}</h4></div>
            <div className="div_flex_centro">
                <div className="alinea_derecha">
                    <div>
                        <label htmlFor="cantidad">Cantidad:</label>
                    </div>
                    <div>
                        <label htmlFor="costo_unitario">Costo Unitario:</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            type="number"
                            name="cantidad"
                            value={catalogo.cantidad || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="costo_unitario"
                            value={catalogo.costo_unitario || ""}
                            onChange={handleInputChange}
                            required
                            disabled={disableInputs}
                        />
                    </div>
                </div>
                <div>
                    <button className="boton_cart_item" onClick={handleRemoveClick}>X</button>
                </div>
            </div>
        </div>
    );
};
