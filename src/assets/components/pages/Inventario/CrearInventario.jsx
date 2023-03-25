import React, { useEffect, useState } from 'react';
import { PeticionAjax } from '../../../helpers/AjaxPetition';
import { GlobalAlmacen, GlobalCatalogo, GlobalInventario } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import { Message } from '../../common/Message';




export const CrearInventario = () => {
    const { formulario, enviado, cambiado } = useForm({});
    const [resultado, setResultado] = useState("No enviado");
    const [almacenes, setAlmacenes] = useState([]);
    const [catalogos, setCatalogos] = useState([]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        //Recoger datos del formulario
        let nuevoInventario = formulario;
        //Guardar articulo en el backend
        const { datos } = await PeticionAjax(GlobalInventario.url + "crear", "POST", nuevoInventario);
        if (datos.status === "success") {
            setResultado("Guardado");
        } else {
            setResultado("Error");
        }
    };

    useEffect(() => {
        const fetchAlmacenes = async () => {
            const { datos } = await PeticionAjax(GlobalAlmacen.url + "mostrar", "GET");
            if (datos.status === "success") {
                setAlmacenes(datos.almacenes);
            }
        };

        fetchAlmacenes();
    }, []);

    useEffect(() => {
        const fetchCatalogos = async () => {
            const { datos } = await PeticionAjax(GlobalCatalogo.url + "mostrar", "GET");
            if (datos.status === "success") {
                setCatalogos(datos.catalogos);
            }
        };

        fetchCatalogos();
    }, []);


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Almacén:
                    <select name="id_almacen" onChange={cambiado}>
                        <option value="">Seleccione un almacén</option>
                        {almacenes && almacenes.map((almacen) => (
                            <option key={almacen.id} value={almacen.id}>
                                {almacen.id}-{almacen.nombre} {/* Replace 'name' with the actual property name for the almacen name */}
                            </option>
                        ))}
                    </select>
                </label>

                <br />
                <label>Catalogo:
                    <select name="id_catalogo" onChange={cambiado}>
                        <option value="">Seleccione un catalogo</option>
                        {catalogos && catalogos.map((catalogo) => (
                            <option key={catalogo.id} value={catalogo.id}>
                                {catalogo.id}-{catalogo.nombre} {/* Replace 'name' with the actual property name for the almacen name */}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>Costo actual:
                    <input type="number" step="0.00001" name="costo_actual" onChange={cambiado} />
                </label>
                <br />
                <label>Cantidad actual:
                    <input type="number" name="cantidad_actual" onChange={cambiado} />
                </label>
                <br />
                <button type="submit">Crear inventario</button>
                <br />
            </form>
            {resultado !== 'No enviado' && (
                <>
                    <br />
                    <Message resultado={resultado} setResultado={setResultado} />
                </>
            )}
        </>
    );
};


