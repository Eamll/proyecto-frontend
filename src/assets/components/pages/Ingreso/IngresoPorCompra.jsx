import React, { useState, useEffect } from "react";
import { PeticionAjax } from "../../../helpers/AjaxPetition";
import { GlobalCompra } from "../../../helpers/Global";

import { ListadoCompras } from "./ListadoCompras";

export const IngresoPorCompra = ({ searchQuery }) => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        fetchCompras();
    }, []);


    const fetchCompras = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCompra.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCompras(datos.compras)
        }
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

        </>
    );
};
