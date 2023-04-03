import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { getUserIdFromToken } from "../../../helpers/auth";
import { GlobalAlmacen, GlobalConceptoTraspaso, GlobalInventario, GlobalMaestroTraspaso } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";


import { CartItem } from "../Ingreso/CartItem";
import { ListadoAIngresar } from "../Ingreso/ListadoAIngresar";

export const MaestroTraspaso = ({ searchQuery }) => {
    const [inventarios, setInventarios] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [catalogos, setCatalogos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [resultado, setResultado] = useState("No enviado");
    const [conceptosTraspaso, setConceptosTraspaso] = useState([]);
    const [selectedAlmacen, setSelectedAlmacen] = useState(1);
    const [selectedAlmacenTo, setSelectedAlmacenTo] = useState(2);


    const handleWheel = (e) => {
        e.target.blur();
    };



    useEffect(() => {
        const myElement = document.getElementById('layout_pagina');
        myElement.className = 'layout';
        setCargando(true);

        fetchAlmacenes();
        fetchConceptosTraspaso();
        fetchInventarios();
        // console.log(inventarios);
    }, [selectedAlmacen, selectedAlmacenTo]);



    const fetchInventarios = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalInventario.url + 'mostrar/' + selectedAlmacen, 'GET');
        if (datos.status === "success") {
            setInventarios(datos.inventarios)
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

    const fetchConceptosTraspaso = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalConceptoTraspaso.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setConceptosTraspaso(datos.conceptosTraspaso);
            // Set the first almacen ID as the default value for the id_almacen input
            setFormulario((prevFormulario) => ({
                ...prevFormulario,
                id_concepto_traspaso: datos.conceptosTraspaso[0]?.id || "",
            }));
        }
        setCargando(false);
    };

    const filteredCatalogos = inventarios
        .map((inventario) => {
            return {
                ...inventario.catalogo,
                cantidad: inventario.cantidad_actual,
                costo_unitario: inventario.costo_actual
            };
        })
        .filter((catalogo) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            const catalogoNombre = catalogo.nombre.toLowerCase();
            const catalogoId = catalogo.codigo_interno.toString();
            return catalogoNombre.includes(query) || catalogoId.includes(query);
        });


    const [cart, setCart] = useState([]);
    const updateCartItem = (itemId, field, value) => {
        setCart((prevCart) => {
            return prevCart.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
            );
        });
    };
    const handleAddToCart = (catalogo) => {
        const inventoryItem = inventarios.find(
            (inventario) => inventario.catalogo.id === catalogo.id
        );

        const cartItem = {
            ...catalogo,
            cantidad: inventoryItem.cantidad_actual,
            costo_unitario: inventoryItem.costo_actual,
            inventoryReference: inventoryItem,
        };

        setCart([...cart, cartItem]);

        setCatalogos((prevCatalogos) =>
            prevCatalogos.filter((item) => item.id !== catalogo.id)
        );

        setInventarios((prevInventarios) =>
            prevInventarios.filter((inventario) => inventario.catalogo.id !== catalogo.id)
        );
    };



    const handleRemoveFromCart = (cartItem) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== cartItem.id));

        setCatalogos((prevCatalogos) => [...prevCatalogos, cartItem]);

        setInventarios((prevInventarios) => [
            ...prevInventarios,
            cartItem.inventoryReference,
        ]);
    };



    const {
        formulario,
        cambiado,
        setFormulario,
    } = useForm({
        id_concepto_traspaso: "",
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
            id_almacen_origen: selectedAlmacen,
            id_almacen_destino: selectedAlmacenTo,
        };

        // Combine form data and cart data
        const dataToSend = {
            form: formDataWithId,
            cart: cart,
        };
        console.log(JSON.stringify(dataToSend));
        const { datos } = await PeticionAjax(GlobalMaestroTraspaso.url + "crear", "POST", dataToSend);
        if (datos.status === "success") {
            console.log(datos.message);
            setResultado("Guardado");
        } else {
            setResultado("Error");
            console.error("Error submitting data:", datos.message);
        }

        setFormulario({
            id_concepto_traspaso: "",
            // id_almacen: "",
            costo_transporte: "",
            costo_carga: "",
            costo_almacenes: "",
            otros_costos: "",
            observaciones: "",
            // observaciones: "",

        });

        // Reset cart data
        setCart([]);

        // Reset selectedAlmacen to its initial value (first almacen ID)
        setSelectedAlmacen(almacenes[0]?.id || "");

        // Refetch catalogos
        fetchInventarios();
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
                    }}
                    required
                >
                    {almacenes
                        .filter((almacen) => almacen.id !== selectedAlmacenTo)
                        .map((almacen) => (
                            <option key={almacen.id} value={almacen.id}>
                                {almacen.nombre}
                            </option>
                        ))}
                </select>

            </div>
            <div className="div_full_width">
                <h2>Seleccionar almacén de destino</h2>
                <select
                    name="id_almacen_to"
                    value={selectedAlmacenTo}
                    onChange={(e) => {
                        setSelectedAlmacenTo(e.target.value);
                    }}
                    required
                >
                    {almacenes
                        .filter((almacen) => almacen.id !== selectedAlmacen)
                        .map((almacen) => (
                            <option key={almacen.id} value={almacen.id}>
                                {almacen.nombre}
                            </option>
                        ))}
                </select>
            </div>


            <div className="div_full_width"><h2>Artículos disponibles en el inventario</h2></div>

            {cargando ? "Cargando" :
                ((filteredCatalogos.length >= 1) || (cart.length >= 1)) ?
                    (<>
                        {/* {console.log(filteredCatalogos)} */}
                        <div className="maestro-ingreso">
                            <ListadoAIngresar catalogos={filteredCatalogos} onAddToCart={handleAddToCart} />
                        </div>
                            <h2>Artículos del Carrito</h2>
                        <div className="div_full_width maestro-ingreso">
                            {cart.map((item) => (
                                <CartItem key={item.id} catalogo={item} updateCartItem={updateCartItem} handleRemoveFromCart={handleRemoveFromCart} />
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>
                                Concepto Traspaso:<br />
                                <select
                                    name="id_concepto_traspaso"
                                    value={formulario.id_concepto_traspaso}
                                    onChange={cambiado}
                                    required
                                >
                                    {conceptosTraspaso.map((concepto_traspaso) => (
                                        <option key={concepto_traspaso.id} value={concepto_traspaso.id}>
                                            {concepto_traspaso.nombre}
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
                    <h1>No hay inventarios</h1>
            }
        </>
    );
};
