import React, { useEffect, useState } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { getUserIdFromToken } from "../../../helpers/auth";
import { GlobalInventario, GlobalMaestroSalida } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";


import { CartItem } from "../Ingreso/CartItem";
import { ListadoAIngresar } from "../Ingreso/ListadoAIngresar";

export const MaestroSalida = ({ searchQuery }) => {
    const [inventarios, setInventarios] = useState([]);
    const [catalogos, setCatalogos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [resultado, setResultado] = useState("No enviado");
    const [almacen, setAlmacen] = useState(1);
    useEffect(() => {
        fetchInventarios();
        // console.log(inventarios);
    }, []);


    const fetchInventarios = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalInventario.url + 'mostrar/' + almacen, 'GET');
        if (datos.status === "success") {
            setInventarios(datos.inventarios)

        }
        setCargando(false);
    };




    const filteredCatalogos = inventarios
        .map((inventario) => {
            return {
                ...inventario.catalogo,
                cantidad: inventario.cantidad,
                costo_unitario: inventario.costo_unitario
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

    const handleAddToCart = (catalogo) => {
        setCart([...cart, catalogo]);
        setCatalogos((prevCatalogos) =>
            prevCatalogos.filter((item) => item.id !== catalogo.id)
        );
        setInventarios((prevInventarios) =>
            prevInventarios.filter((inventario) => inventario.catalogo.id !== catalogo.id)
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
        cambiado,
        setFormulario,
    } = useForm({
        id_concepto_salida: "",
        id_almacen: "",
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
        const { datos } = await PeticionAjax(GlobalMaestroSalida.url + "crear", "POST", dataToSend);
        if (datos.status === "success") {
            console.log(datos.message);
            setResultado("Guardado");
        } else {
            setResultado("Error");
            console.error("Error submitting data:", datos.message);
        }

        setFormulario({
            id_concepto_salida: "",
            id_almacen: "",
            observaciones: "",
        });
    };

    return (
        <>
            <div className="div_full_width"><h2>Artículos disponibles en el inventario</h2></div>
            {/* {console.log(filteredInventarios)} */}
            {cargando ? "Cargando" :
                filteredCatalogos.length >= 1 ?
                    (<>
                        {/* {console.log(filteredCatalogos)} */}
                        <div className="maestro-ingreso">
                            <ListadoAIngresar catalogos={filteredCatalogos} onAddToCart={handleAddToCart} />
                        </div>
                        <div className="div_full_width">
                            <h2>Artículos del Carrito</h2>
                            {cart.map((item) => (
                                <CartItem key={item.id} catalogo={item} updateCartItem={updateCartItem} />
                            ))}

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="number"
                                    name="id_concepto_salida"
                                    value={formulario.id_concepto_salida}
                                    onChange={cambiado}
                                    placeholder="id_concepto_salida"
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
