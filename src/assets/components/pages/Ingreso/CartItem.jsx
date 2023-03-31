// CartItem.js
import React from "react";

export const CartItem = ({ catalogo, updateCartItem }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateCartItem(catalogo.id, name, value);
    };

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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
