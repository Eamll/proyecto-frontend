import React, { useState, useEffect } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { GlobalCompra } from "../../../helpers/Global";

import { ListadoCompras } from "./ListadoCompras";
import { useLocation } from "react-router-dom";
import Snackbar from "../../common/SnackBar";

export const IngresoPorCompra = ({ searchQuery }) => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [resultado, setResultado] = useState("No enviado");


    const location = useLocation();
    const [snackbar, setSnackbar] = useState(location.state?.snackbar ?? { show: false, type: '', message: '' });

    useEffect(() => {
        fetchCompras();
    }, []);


    const fetchCompras = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCompra.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCompras(datos.compras)
        }
        setResultado(datos.status)
        setCargando(false);
    };


    const filteredCompras = compras.filter((compra) => {
        if (!searchQuery) return true; // If searchQuery is not defined or empty, return true to show all catalogos
        const query = searchQuery.toLowerCase();
        const compraId = compra.id.toString();
        return compraId.includes(query)
    });

    return (
        <>
            {cargando ? "Cargando" :
                filteredCompras.length >= 1 ?
                    <ListadoCompras compras={filteredCompras} setCompras={setCompras} /> :
                    <h1>No hay productos</h1>}
            <Snackbar show={snackbar.show} type={snackbar.type} message={snackbar.message} />

        </>
    );
};
