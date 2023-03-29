import React, { useState, useEffect } from "react";
import { PeticionAjax } from "../../helpers/AjaxPetition";
import { GlobalCatalogo } from "../../helpers/Global";
import { Listado } from "./Listado";

export const ListaCatalogos = ({ searchQuery }) => {
    const [catalogos, setCatalogos] = useState([]);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        fetchCatalogos();
    }, []);

    // const handleSearchQueryChange = (event) => {
    //     setSearchQuery(event.target.value);
    // };

    const fetchCatalogos = async () => {

        const { datos, cargando } = await PeticionAjax(GlobalCatalogo.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCatalogos(datos.catalogos)
        }
        setCargando(false);
    };


    const filteredCatalogos = catalogos.filter((catalogo) => {
        if (!searchQuery) return true; // If searchQuery is not defined or empty, return true to show all catalogos
        const catalogoNombre = catalogo.nombre.toLowerCase();
        const query = searchQuery.toLowerCase();
        return catalogoNombre.includes(query);
    });

    return (
        <>
            {cargando ? "Cargando" :
                filteredCatalogos.length >= 1 ?
                    <Listado catalogos={filteredCatalogos} setCatalogos={setCatalogos} /> :
                    <h1>No hay productos</h1>}

        </>
    );
};

// export const searchQueryState = {
//     searchQuery: "",
//     setSearchQuery: () => { },
// };

// export const handleSearchQueryChangeState = {
//     handleSearchQueryChange: () => { },
// };