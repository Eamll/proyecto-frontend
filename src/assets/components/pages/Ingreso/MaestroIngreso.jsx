import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { getUserIdFromToken } from "../../../helpers/auth";
import { GlobalCatalogo, GlobalMaestroIngreso } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";
import { CartItem } from "./CartItem";
import { ListadoAIngresar } from "./ListadoAIngresar";

export const MaestroIngreso = ({ searchQuery }) => {
    const [catalogos, setCatalogos] = useState([]); // Your initial catalogos data
    const [cargando, setCargando] = useState(true);
    useEffect(() => {
        fetchCatalogos();
    }, []);


    const fetchCatalogos = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCatalogo.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCatalogos(datos.catalogos)
        }
        setCargando(false);
    };
    const filteredCatalogos = catalogos.filter((catalogo) => {
        if (!searchQuery) return true; // If searchQuery is not defined or empty, return true to show all catalogos
        const query = searchQuery.toLowerCase();
        const catalogoNombre = catalogo.nombre.toLowerCase();
        const catalogoId = catalogo.codigo_interno.toString();
        return catalogoNombre.includes(query) ||
            catalogoId.includes(query)
    });



    const [cart, setCart] = useState([]);

    const handleAddToCart = (catalogo) => {
        setCart([...cart, catalogo]);
        setCatalogos((prevCatalogos) =>
            prevCatalogos.filter((item) => item.id !== catalogo.id)
        );
    };

    const updateCartItem = (itemId, field, value) => {
        setCart((prevCart) => {
            return prevCart.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
            );
        });
    };

    const {
        formulario,
        // enviado,
        cambiado,
        setFormulario,
    } = useForm({
        id_concepto_ingreso: "",
        id_almacen: "",
        costo_transporte: "",
        costo_carga: "",
        costo_almacenes: "",
        otros_costos: "",
        observaciones: "",
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserIdFromToken().toString();
        console.log('User ID from token:', userId);
        const formDataWithId = {
            ...formulario,
            id_personal: userId,
        };

        // Combine form data and cart data
        const dataToSend = {
            form: formDataWithId,
            cart: cart,
        };
        console.log(JSON.stringify(dataToSend));
        const { datos } = await PeticionAjax(GlobalMaestroIngreso.url + "crear", "POST", dataToSend);
        if (datos.status === "success") {

            console.log(datos.message);
            // setResultado("Guardado");

        } else {
            // setResultado("Error");
            console.error("Error submitting data:", datos.message);
        }

        setFormulario({
            id_concepto_ingreso: "",
            id_almacen: "",

            costo_transporte: "",
            costo_carga: "",
            costo_almacenes: "",
            otros_costos: "",
            observaciones: "",
        });
    };

    return (
        <>
            <div className="div_full_width"><h2>Artículos disponibles en el catálogo</h2></div>
            {cargando ? "Cargando" :
                filteredCatalogos.length >= 1 ?
                    (<><div className="maestro-ingreso">
                        <ListadoAIngresar catalogos={filteredCatalogos} onAddToCart={handleAddToCart} />
                    </div>
                        <div className="div_full_width">
                            <h2>Artículos del Carrito</h2>
                            {cart.map((item) => (
                                <CartItem key={item.id} catalogo={item} updateCartItem={updateCartItem} />
                            ))}

                            <form onSubmit={handleSubmit}>
                                {/* The rest of the form inputs and submit button */}
                                <input
                                    type="number"
                                    name="id_concepto_ingreso"
                                    value={formulario.id_concepto_ingreso}
                                    onChange={cambiado}
                                    placeholder="id_concepto_ingreso"
                                    required
                                />
                                <input
                                    type="number"
                                    name="id_almacen"
                                    value={formulario.id_almacen}
                                    onChange={cambiado}
                                    placeholder="id_almacen"
                                    required
                                />

                                <br />
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
                        </div></>) :
                    <h1>No hay productos</h1>
            }
        </>
    );
};
