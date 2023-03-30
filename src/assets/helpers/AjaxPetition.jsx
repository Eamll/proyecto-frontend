import { getToken } from './auth';

export const PeticionAjax = async (url, metodo, datosGuardar = "", archivos = false) => {
    let cargando = true;

    // Get the token from localStorage
    const token = getToken();

    let opciones = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    if (metodo == "GET" || metodo == "DELETE") {
        opciones = {
            method: metodo,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    if (metodo == "POST" || metodo == "PUT") {
        if (archivos) {
            opciones = {
                method: metodo,
                body: datosGuardar,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        } else {
            opciones = {
                method: metodo,
                body: JSON.stringify(datosGuardar),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
        }
    }

    const peticion = await fetch(url, opciones);
    const datos = await peticion.json();

    cargando = false;

    return {
        datos,
        cargando,
    };
};
