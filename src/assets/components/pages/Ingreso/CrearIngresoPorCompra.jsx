import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalDetalleCompra, GlobalMaestroIngreso } from '../../../helpers/Global';
import { PeticionAjax } from '../../../helpers/AjaxPetition';
import { useForm } from '../../../hooks/useForm';
import { getUserIdFromToken } from '../../../helpers/auth';


export const CrearIngresoPorCompra = () => {
    const params = useParams();
    const [detallesCompra, setDetallesCompra] = useState([]);
    const [resultado, setResultado] = useState("No enviado");
    const { formulario, cambiado } = useForm({
        id_concepto_ingreso: '',
        id_almacen: '',
        costo_transporte: '',
        costo_carga: '',
        costo_almacenes: '',
        otros_costos: '',
        observaciones: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetallesCompra();
    }, [params.id]);

    const fetchDetallesCompra = async () => {
        const { datos, cargando } = await PeticionAjax(GlobalDetalleCompra.url + 'id/' + params.id, 'GET');
        // console.log(datos)
        if (datos.status === "success") {
            setDetallesCompra(datos.detallesCompra)
        }
        setResultado(datos.status)
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const userId = getUserIdFromToken().toString();
            const cart = detallesCompra.map((detalle) => ({
                id: detalle.catalogo.id,
                nombre: detalle.catalogo.nombre,
                codigo_interno: detalle.catalogo.codigo_interno,
                cantidad: detalle.cantidad,
                costo_unitario: detalle.precio
            }));
            console.log(JSON.stringify({ form: { ...formulario, id_compra: params.id, id_personal: userId }, cart }));
            const { datos } = await PeticionAjax(GlobalMaestroIngreso.url + "crear", "POST", { form: { ...formulario, id_compra: params.id, id_personal: userId }, cart });
            // console.log(datos);
            if (datos.status === "success") {
                console.log(datos.message);
                navigate('/ingreso-compra');
            } else {
                console.error("Error submitting data:", datos.message);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };


    return (
        <div>
            <h1>CrearIngresoPorCompra</h1>
            {resultado === "success" ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        name="id_concepto_ingreso"
                        value={formulario.id_concepto_ingreso}
                        onChange={cambiado}
                        placeholder="id_concepto_ingreso"
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
                    {detallesCompra.map((detalle) => (
                        <div key={detalle.id}>
                            <h2>{detalle.catalogo.nombre}</h2>
                            <p>Código interno: {detalle.catalogo.codigo_interno}</p>
                            <p>Precio: ${detalle.precio}</p>
                            <p>Cantidad: {detalle.cantidad}</p>
                        </div>
                    ))}
                    <input
                        type="number"
                        name="costo_transporte"
                        value={formulario.costo_transporte}
                        onChange={cambiado}
                        placeholder="Costo Transporte"
                        required
                    />
                    <br />
                    <input
                        type="number"
                        name="costo_carga"
                        value={formulario.costo_carga}
                        onChange={cambiado}
                        placeholder="Costo Carga"
                        required
                    />
                    <br />
                    <input
                        type="number"
                        name="costo_almacenes"
                        value={formulario.costo_almacenes}
                        onChange={cambiado}
                        placeholder="Costo Almacenes"
                        required
                    />
                    <br />
                    <input
                        type="number"
                        name="otros_costos"
                        value={formulario.otros_costos}
                        onChange={cambiado}
                        placeholder="Otros Costos"
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


            ) : (
                resultado === "error" && (
                    <p>No existe un detalle para esta compra</p>
                )
            )}
        </div>
    );
};
