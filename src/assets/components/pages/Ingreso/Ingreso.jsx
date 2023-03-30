import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PeticionAjax } from '../../../helpers/AjaxPetition';
import { GlobalAlmacen, GlobalIngreso } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import { Message } from '../../common/Message';

export const Ingreso = () => {
    const { formulario, enviado, cambiado } = useForm({});
    const [resultado, setResultado] = useState("No enviado");
    const [compras, setCompras] = useState([]);
    const [conceptosIngreso, setConceptosIngreso] = useState([]);
    const [personales, setPersonales] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);

    const location = useLocation();
    const catalogoNombre = location.state?.nombre;



    const handleSubmit = async (event) => {
        event.preventDefault();
        let nuevoIngreso = formulario;
        const { datos } = await PeticionAjax(GlobalIngreso.url + "crear", "POST", nuevoIngreso);
        if (datos.status === "success") {
            setResultado("Guardado");
        } else {
            setResultado("Error");
        }
    };

    useEffect(() => {
        // const fetchCompras = async () => {
        //     const { datos } = await PeticionAjax(GlobalCompra.url + "mostrar", "GET");
        //     if (datos.status === "success") {
        //         setCompras(datos.compras);
        //     }
        // };

        // const fetchConceptosIngreso = async () => {
        //     const { datos } = await PeticionAjax(GlobalConceptoIngreso.url + "mostrar", "GET");
        //     if (datos.status === "success") {
        //         setConceptosIngreso(datos.conceptosIngreso);
        //     }
        // };

        // const fetchPersonales = async () => {
        //     const { datos } = await PeticionAjax(GlobalPersonal.url + "mostrar", "GET");
        //     if (datos.status === "success") {
        //         setPersonales(datos.personales);
        //     }
        // };

        const fetchAlmacenes = async () => {
            const { datos } = await PeticionAjax(GlobalAlmacen.url + "mostrar", "GET");
            if (datos.status === "success") {
                setAlmacenes(datos.almacenes);
            }
        };

        // fetchCompras();
        // fetchConceptosIngreso();
        // fetchPersonales();
        fetchAlmacenes();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* <label>Fecha:
                    <input type="datetime-local" name="fecha" onChange={cambiado} />
                </label> */}
                {/* <br /> */}
                Realizando un ingreso para el producto :{catalogoNombre}
                <br></br>
                <label>Costo transporte:
                    <input type="number" step="0.01" name="costo_transporte" onChange={cambiado} defaultValue="0.00" />
                </label>
                <br />
                <label>Costo carga:
                    <input type="number" step="0.01" name="costo_carga" onChange={cambiado} defaultValue="0.00" />
                </label>
                <br />
                <label>Costo almacenes:
                    <input type="number" step="0.01" name="costo_almacenes" onChange={cambiado} defaultValue="0.00" />
                </label>
                <br />
                <label>Otros costos:
                    <input type="number" step="0.01" name="otros_costos" onChange={cambiado} defaultValue="0.00" />
                </label>
                <br />
                <label>Observaciones:
                    <input type="text" name="observaciones" onChange={cambiado} defaultValue="Ninguna" />
                </label>
                <br />

                <label>Cantidad a Ingresar:
                    <input type="text" name="costo_unitario" onChange={cambiado} />
                </label>
                <br />

                <label>Concepto ingreso:
                    <select name="id_concepto_ingreso" onChange={cambiado} required>
                        {/* <option value="">Seleccione un concepto de ingreso</option>
                        {conceptosIngreso && conceptosIngreso.map((conceptoIngreso) => (
                            <option key={conceptoIngreso.id} value={conceptoIngreso.id}>
                                {conceptoIngreso.id}-{conceptoIngreso.nombre}
                            </option>
                        ))} */}
                    </select>
                </label>
                <br />
                <label>Compra:
                    <select name="id_compra" onChange={cambiado}>
                        {/* <option value="">Seleccione una compra</option>
                        {compras && compras.map((compra) => (
                            <option key={compra.id} value={compra.id}>
                                {compra.id}-{compra.nombre}
                            </option>
                        ))} */}
                    </select>
                </label>
                <br />
                <label>Costo Unitario:
                    <input type="text" name="costo_unitario" onChange={cambiado} />
                </label>
                <br />
                <label label > Almacén:
                    <select name="id_almacen" onChange={cambiado} required>
                        <option value="">Seleccione un almacén</option>
                        {almacenes && almacenes.map((almacen) => (
                            <option key={almacen.id} value={almacen.id}>
                                {almacen.id}-{almacen.nombre}
                            </option>
                        ))}
                    </select>
                </label >
                <br />
                <button type="submit">Crear Ingreso</button>
                <br />
            </form >
            {resultado !== 'No enviado' && (
                <>
                    <br />
                    <Message resultado={resultado} setResultado={setResultado} />
                </>
            )}
        </>
    );
};
