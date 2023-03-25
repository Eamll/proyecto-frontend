import React, { useState, useEffect } from "react";

import { PeticionAjax } from "../../helpers/AjaxPetition";
import { GlobalCatalogo } from "../../helpers/Global";
import { Listado } from "./Listado";

export const ListaCatalogos = () => {
    const [catalogos, setCatalogos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalCatalogo.url + 'mostrar', 'GET');
        if (datos.status === "success") {
            setCatalogos(datos.catalogos)
        }
        setCargando(false);
    };

    const handleSearchQueryChange = (event) => {
        console.log("cambio");
        setSearchQuery(event.target.value);
    };

    const filteredCatalogos = catalogos.filter((catalogo) => {
        const catalogoNombre = catalogo.nombre.toLowerCase();
        const query = searchQuery.toLowerCase();
        return catalogoNombre.includes(query);
    });

    return (
        <>

            <div>
                <input type="text" name="search_catalogo" value={searchQuery} onChange={handleSearchQueryChange} placeholder="Buscar catálogos" />
            </div>

            {cargando ? "Cargando" :
                filteredCatalogos.length >= 1 ?
                    <Listado catalogos={filteredCatalogos} setCatalogos={setCatalogos} /> :
                    <h1>No hay productos</h1>}
        </>
    );
};
