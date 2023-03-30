import React from "react";
import { useForm } from "../../../hooks/useForm";


export const CartItem = ({ catalogo }) => {
    const { formulario, enviado, cambiado } = useForm({
        cantidad: "",
        costo_unitario: "",
    });

    return (
        <div className="cart-item">
            <div><h4>{catalogo.nombre}</h4></div>
            <form onSubmit={enviado}>
                <div class="div_flex_centro">
                    <div class="alinea_derecha">
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
                                name="costo_unitario"
                                value={formulario.costo_unitario}
                                onChange={cambiado}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                name="cantidad"
                                value={formulario.cantidad}
                                onChange={cambiado}
                                required
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
