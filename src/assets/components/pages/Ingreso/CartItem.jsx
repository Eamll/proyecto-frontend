import React from "react";
import { useForm } from "../../../hooks/useForm";


export const CartItem = ({ catalogo }) => {
    const { formulario, enviado, cambiado } = useForm({
        cantidad: "",
        costo_unitario: "",
    });

    return (
        <div className="cart-item">
            <h4>{catalogo.nombre}</h4>
            <form onSubmit={enviado}>
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                    type="number"
                    name="cantidad"
                    value={formulario.cantidad}
                    onChange={cambiado}
                    required
                />
                <br />

                <label htmlFor="costo_unitario">Costo Unitario:</label>
                <input
                    type="number"
                    name="costo_unitario"
                    value={formulario.costo_unitario}
                    onChange={cambiado}
                    required
                />
                <br />
            </form>
        </div>
    );
};
