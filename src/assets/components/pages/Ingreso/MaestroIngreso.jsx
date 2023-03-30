import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { GlobalCatalogo } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";
import { CartItem } from "./CartItem";
import { ListadoAIngresar } from "./ListadoAIngresar";

export const MaestroIngreso = () => {
    const [catalogos, setCatalogos] = useState([]); // Your initial catalogos data
    useEffect(() => {
        fetchCatalogos();
    }, []);


    const fetchCatalogos = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCatalogo.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCatalogos(datos.catalogos)
        }
        // setCargando(false);
    };



    const [cart, setCart] = useState([]);

    const handleAddToCart = (catalogo) => {
        setCart([...cart, catalogo]);
        setCatalogos((prevCatalogos) =>
            prevCatalogos.filter((item) => item.id !== catalogo.id)
        );
    };

    const {
        formulario,
        // enviado,
        cambiado,
        setFormulario,
    } = useForm({
        costo_transporte: "",
        costo_carga: "",
        costo_almacenes: "",
        otros_costos: "",
        observaciones: "",
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine form data and cart data
        const dataToSend = {
            form: formulario,
            cart: cart,
        };

        const { datos } = await PeticionAjax(GlobalCatalogo.url + "crear", "POST", dataToSend);
        if (datos.status === "success") {

            console.log(datos.message);
            // setResultado("Guardado");

        } else {
            // setResultado("Error");
            console.error("Error submitting data:", datos.message);
        }

        setFormulario({
            costo_transporte: "",
            costo_carga: "",
            costo_almacenes: "",
            otros_costos: "",
            observaciones: "",
        });
    };

    return (
        <>
            <div className="maestro-ingreso">

                <br />
                <h2>Available Catalog Items</h2>
                <ListadoAIngresar catalogos={catalogos} onAddToCart={handleAddToCart} />

                <h2>Items in Cart</h2>
                {cart.map((item) => (
                    <CartItem key={item.id} catalogo={item} />
                ))}

                <form onSubmit={handleSubmit}>
                    {/* The rest of the form inputs and submit button */}

                    <input
                        type="number"
                        name="id_almacen"
                        value={1}
                        onChange={cambiado}
                        placeholder="id_almacen"
                        required
                    />
                    <input
                        type="number"
                        name="id_compra"
                        value={1}
                        onChange={cambiado}
                        placeholder="id_compra"
                        required
                    />

                    <input
                        type="number"
                        name="costo_transporte"
                        value={formulario.costo_transporte}
                        onChange={cambiado}
                        placeholder="Costo Transporte"
                        required
                    />
                    <br />

                    <input
                        type="number"
                        name="costo_carga"
                        value={formulario.costo_carga}
                        onChange={cambiado}
                        placeholder="Costo Carga"
                        required
                    />
                    <br />

                    <input
                        type="number"
                        name="costo_almacenes"
                        value={formulario.costo_almacenes}
                        onChange={cambiado}
                        placeholder="Costo Almacenes"
                        required
                    />
                    <br />

                    <input
                        type="number"
                        name="otros_costos"
                        value={formulario.otros_costos}
                        onChange={cambiado}
                        placeholder="Otros Costos"
                        required
                    />
                    <br />

                    <textarea
                        name="observaciones"
                        value={formulario.observaciones}
                        onChange={cambiado}
                        placeholder="Observaciones"
                        required
                    />
                    <br />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
};
