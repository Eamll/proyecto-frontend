import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { getUserIdFromToken } from "../../../helpers/auth";
import { GlobalAlmacen, GlobalCatalogo, GlobalConceptoIngreso, GlobalMaestroIngreso } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";
import { CartItem } from "./CartItem";
import { ListadoAIngresar } from "./ListadoAIngresar";
import { Message } from "../../common/Message";

// Message
export const MaestroIngreso = ({ searchQuery }) => {
    const [catalogos, setCatalogos] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [conceptosIngreso, setConceptosIngreso] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [resultado, setResultado] = useState("No enviado");
    const [selectedAlmacen, setSelectedAlmacen] = useState(1);

    /* ----------*/
    const handleWheel = (e) => {
        e.target.blur();
    };

    /* ----------*/

    useEffect(() => {
        const myElement = document.getElementById('layout_pagina');
        myElement.className = 'layout';
        fetchCatalogos();
        fetchAlmacenes();
        fetchConceptosIngreso();
    }, [selectedAlmacen]);


    const fetchCatalogos = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCatalogo.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCatalogos(datos.catalogos)
        }
        setCargando(false);
    };
    const fetchAlmacenes = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalAlmacen.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setAlmacenes(datos.almacenes);
            // Set the first almacen ID as the default value for the id_almacen input
            setFormulario((prevFormulario) => ({
                ...prevFormulario,
                id_almacen: datos.almacenes[0]?.id || "",
            }));
        }
        setCargando(false);
    };

    const fetchConceptosIngreso = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalConceptoIngreso.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setConceptosIngreso(datos.conceptosIngreso);
            // Set the first almacen ID as the default value for the id_almacen input
            setFormulario((prevFormulario) => ({
                ...prevFormulario,
                id_concepto_ingreso: datos.conceptosIngreso[0]?.id || "",
            }));
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

    const handleRemoveFromCart = (catalogo) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== catalogo.id));
        setCatalogos((prevCatalogos) => [...prevCatalogos, catalogo]);

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
            id_almacen: selectedAlmacen,
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
            setResultado("Guardado");

        } else {
            setResultado("Error");
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
        // Reset cart data
        setCart([]);

        // Reset selectedAlmacen to its initial value (first almacen ID)
        setSelectedAlmacen(almacenes[0]?.id || "");

        // Refetch catalogos
        fetchCatalogos();
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div className="div_full_width">
                <h2>Seleccionar almacén</h2>
                <select
                    name="id_almacen"
                    value={selectedAlmacen}
                    onChange={(e) => {
                        setSelectedAlmacen(e.target.value);
                        setCart([]);
                        // setAlmacen(e.target.value);
                    }}
                    required
                >
                    {almacenes.map((almacen) => (
                        <option key={almacen.id} value={almacen.id}>
                            {almacen.nombre}
                        </option>
                    ))}
                </select>

            </div>
            <div className="div_full_width"><h2>Artículos disponibles en el catálogo</h2></div>
            {cargando ? "Cargando" :
                ((filteredCatalogos.length >= 1) || (cart.length >= 1)) ?
                    (<><div className="maestro-ingreso">
                        <ListadoAIngresar catalogos={filteredCatalogos} onAddToCart={handleAddToCart} />
                    </div>
                            <h2>Artículos del Carrito</h2>
                        <div className="div_full_width maestro-ingreso">
                            {cart.map((item) => (
                                <CartItem key={item.id} catalogo={item} updateCartItem={updateCartItem} handleRemoveFromCart={handleRemoveFromCart} />
                            ))}

                            
                            {resultado !== 'No enviado' && (
                                <>
                                    <br />
                                    <Message resultado={resultado} setResultado={setResultado} />
                                </>
                            )}
                        </div>
                        <form onSubmit={handleSubmit}>

Concepto Ingreso:<br />
<select
    name="id_concepto_ingreso"
    value={formulario.id_concepto_ingreso}
    onChange={cambiado}
    required
>
    {conceptosIngreso.map((concepto_ingreso) => (
        <option key={concepto_ingreso.id} value={concepto_ingreso.id}>
            {concepto_ingreso.nombre}
        </option>
    ))}
</select>

<br />
<input
    type="number"
    name="costo_transporte"
    value={formulario.costo_transporte}
    onChange={cambiado}
    placeholder="Costo Transporte"
    required
    onWheel={handleWheel}
/>
<br />

<input
    type="number"
    name="costo_carga"
    value={formulario.costo_carga}
    onChange={cambiado}
    placeholder="Costo Carga"
    required
    onWheel={handleWheel}
/>
<br />

<input
    type="number"
    name="costo_almacenes"
    value={formulario.costo_almacenes}
    onChange={cambiado}
    placeholder="Costo Almacenes"
    required
    onWheel={handleWheel}
/>
<br />

<input
    type="number"
    name="otros_costos"
    value={formulario.otros_costos}
    onChange={cambiado}
    placeholder="Otros Costos"
    required
    onWheel={handleWheel}

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
                    </>) :
                    <h1>No hay productos</h1>
            }
        </>
    );
};
