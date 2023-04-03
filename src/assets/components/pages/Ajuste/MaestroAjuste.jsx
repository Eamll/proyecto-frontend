import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { getUserIdFromToken } from "../../../helpers/auth";
import { GlobalAlmacen, GlobalConceptoAjuste, GlobalInventario, GlobalMaestroAjuste } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";


import { CartItem } from "../Ingreso/CartItem";
import { ListadoAIngresar } from "../Ingreso/ListadoAIngresar";

export const MaestroAjuste = ({ searchQuery }) => {
    const [inventarios, setInventarios] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [catalogos, setCatalogos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [resultado, setResultado] = useState("No enviado");
    const [conceptosAjuste, setConceptosAjuste] = useState([]);
    const [selectedAlmacen, setSelectedAlmacen] = useState(1);





    useEffect(() => {
        setCargando(true);

        fetchAlmacenes();
        fetchConceptosAjuste();
        fetchInventarios();
        // console.log(inventarios);
    }, [selectedAlmacen]);


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

    const fetchConceptosAjuste = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalConceptoAjuste.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setConceptosAjuste(datos.conceptosAjuste);
            // Set the first almacen ID as the default value for the id_almacen input
            setFormulario((prevFormulario) => ({
                ...prevFormulario,
                id_concepto_ajuste: datos.conceptosAjuste[0]?.id || "",
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
        id_concepto_ajuste: "",
        id_almacen: "",
        tipo_ajuste: 'S',
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
            tipo_ajuste: formulario.tipo_ajuste,
        };

        // Combine form data and cart data
        const dataToSend = {
            form: formDataWithId,
            cart: cart,
        };
        console.log(JSON.stringify(dataToSend));
        const { datos } = await PeticionAjax(GlobalMaestroAjuste.url + "crear", "POST", dataToSend);
        if (datos.status === "success") {
            console.log(datos.message);
            setResultado("Guardado");
        } else {
            setResultado("Error");
            console.error("Error submitting data:", datos.message);
        }

        setFormulario({
            id_concepto_ajuste: "",
            id_almacen: "",
            tipo_ajuste: 'S',
            observaciones: "",
        });

        // Reset cart data
        setCart([]);

        // Reset selectedAlmacen to its initial value (first almacen ID)
        setSelectedAlmacen(almacenes[0]?.id || "");

        // Refetch catalogos
        fetchInventarios();
        fetchConceptosAjuste();
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


            <div className="div_full_width"><h2>Artículos disponibles en el inventario</h2></div>

            {cargando ? "Cargando" :
                ((filteredCatalogos.length >= 1) || (cart.length >= 1)) ?
                    (<>
                        {/* {console.log(filteredCatalogos)} */}
                        <div className="maestro-ingreso">
                            <ListadoAIngresar catalogos={filteredCatalogos} onAddToCart={handleAddToCart} />
                        </div>
                        <div className="div_full_width">
                            <h2>Artículos del Carrito</h2>
                            {cart.map((item) => (
                                <CartItem key={item.id} catalogo={item} updateCartItem={updateCartItem} handleRemoveFromCart={handleRemoveFromCart} />
                            ))}

                            <form onSubmit={handleSubmit}>
                                Concepto Ajuste:<br />
                                <select
                                    name="id_concepto_ajuste"
                                    value={formulario.id_concepto_ajuste}
                                    onChange={cambiado}
                                    required
                                >
                                    {conceptosAjuste.map((concepto_ajuste) => (
                                        <option key={concepto_ajuste.id} value={concepto_ajuste.id}>
                                            {concepto_ajuste.nombre}
                                        </option>
                                    ))}
                                </select>

                                <br /><br />
                                Tipo Ajuste:<br />
                                <select
                                    name="tipo_ajuste"
                                    value={formulario.tipo_ajuste}
                                    onChange={cambiado}
                                    required
                                >
                                    <option value="S">Sumar</option>
                                    <option value="R">Restar</option>
                                </select>
                                <br />
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
                    <h1>No hay inventarios</h1>
            }
        </>
    );
};
