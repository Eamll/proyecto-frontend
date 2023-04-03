import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo, GlobalSubcategoria, GlobalTipoCatalogo, GlobalUnidadMedida } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const EditarCatalogo = () => {
    const { formulario, enviado, cambiado, setFormulario } = useForm({});
    const [resultado, setResultado] = useState("No enviado");
    const [catalogo, setCatalogo] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();


    const [unidadMedidas, setUnidadMedidas] = useState([]);
    const [tipoCatalogos, setTipoCatalogos] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);



    const params = useParams();

    useEffect(() => {
        const myElement = document.getElementById('layout_pagina');
        myElement.className = 'layout_inicio';
        conseguirCatalogo();
        fetchUnidadMedidas();
        fetchTipoCatalogos();
        fetchSubcategorias();
    }, [])


    const conseguirCatalogo = async () => {
        const { datos } = await PeticionAjax(GlobalCatalogo.url + "id/" + params.id, "GET");

        if (datos.status === "success") {
            setCatalogo(datos.catalogo);
            setFormulario({
                nombre: datos.catalogo.nombre,
                codigo_interno: datos.catalogo.codigo_interno,
                codigo_de_barras: datos.catalogo.codigo_de_barras,
                codigo_proveedor: datos.catalogo.codigo_proveedor,
                descripcion: datos.catalogo.descripcion,
                activo: datos.catalogo.activo,
                id_unidad_medida: datos.catalogo.unidad_medida.id,
                id_tipo_catalogo: datos.catalogo.tipo_catalogo.id,
                id_subcategoria: datos.catalogo.subcategoria.id,
            });
        }
        setCargando(false);
    }



    const fetchUnidadMedidas = async () => {
        const { datos } = await PeticionAjax(GlobalUnidadMedida.url + 'mostrar');
        setUnidadMedidas(datos.unidadesMedida);
    };
    const fetchTipoCatalogos = async () => {
        const { datos } = await PeticionAjax(GlobalTipoCatalogo.url + 'mostrar');
        setTipoCatalogos(datos.tipo_catalogos);
    };
    const fetchSubcategorias = async () => {
        const { datos } = await PeticionAjax(GlobalSubcategoria.url + 'mostrar');
        console.log()
        setSubcategorias(datos.subcategorias);
    };


    const editarCatalogo = async (e) => {

        e.preventDefault()
        let nuevoCatalogo = formulario;
        const { datos } = await PeticionAjax(GlobalCatalogo.url + "id/" + params.id, "PUT", nuevoCatalogo);
        if (datos.status === "success") {
            setResultado("Guardado");
        } else {
            setResultado("Error");
        }
    }
    return (
        <>{
            cargando ? "Cargando" :
                <div className='jumbo'>
                    <h1>Editar Catalogo</h1>
                    <p>Formulario para editar: {catalogo.nombre}</p>
                    {/* <pre>{JSON.stringify(formulario)}</pre> */}
                    <strong>{resultado == "Guardado" ? "Producto guardado con exito" : ""}</strong>
                    <strong>{resultado == "Error" ? "Datos proporcionados son incorrectos" : ""}</strong>
                    {/*Montar formulario*/}
                    <form onSubmit={editarCatalogo}>
                        <div className='form-group'>
                            <label htmlFor='nombre'>Nombre:</label>
                            <input type='text' name='nombre' onChange={cambiado} defaultValue={catalogo.nombre} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='codigo_interno'>Código interno:</label>
                            <input type='text' name='codigo_interno' onChange={cambiado} defaultValue={catalogo.codigo_interno} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='codigo_de_barras'>Código de barras:</label>
                            <input type='text' name='codigo_de_barras' onChange={cambiado} defaultValue={catalogo.codigo_de_barras} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='codigo_proveedor'>Código de provedor:</label>
                            <input type='text' name='codigo_proveedor' onChange={cambiado} defaultValue={catalogo.codigo_proveedor} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='descripcion'>Descripción:</label>
                            <input type='text' name='descripcion' onChange={cambiado} defaultValue={catalogo.descripcion} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='activo'>Activo:</label>
                            <input type='checkbox' name='activo' onChange={cambiado} defaultChecked={catalogo.activo === 'A'} />
                        </div>

                        <div className='form-group'>
                            <label>Unidad de medida:</label>
                            <select name='id_unidad_medida' onChange={cambiado}>
                                {unidadMedidas &&
                                    unidadMedidas.map((unidadMedida) => {
                                        return (
                                            <option
                                                key={unidadMedida.id}
                                                value={unidadMedida.id}
                                                selected={unidadMedida.id === catalogo.unidad_medida.id}>
                                                {unidadMedida.id}-{unidadMedida.nombre}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>

                        <div className='form-group'>
                            <label>Tipo de catálogo:</label>
                            <select name='id_tipo_catalogo' onChange={cambiado}>
                                {tipoCatalogos &&
                                    tipoCatalogos.map((tipoCatalogo) => {
                                        return (
                                            <option
                                                key={tipoCatalogo.id}
                                                value={tipoCatalogo.id}
                                                selected={tipoCatalogo.id === catalogo.tipo_catalogo.id}>
                                                {tipoCatalogo.id}-{tipoCatalogo.nombre}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>

                        <div className='form-group'>
                            <label>Subcategoria:</label>
                            <select name='id_tipo_catalogo' onChange={cambiado}>
                                {subcategorias &&
                                    subcategorias.map((subcategoria) => {
                                        return (
                                            <option
                                                key={subcategoria.id}
                                                value={subcategoria.id}
                                                selected={subcategoria.id === catalogo.subcategoria.id}>
                                                {subcategoria.id}-{subcategoria.nombre}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>


                        <input type="submit" value="Guardar" className='btn btn-success' />
                        <br />
                        <button type='button' className='btn btn-primary mx-2' onClick={() => {

                            navigate('/crear-ingreso', { state: { id: catalogo.id, nombre: catalogo.nombre } });
                        }
                        }>
                            Ingreso</button>
                        <button type='button' className='btn btn-danger' disabled>Egreso</button>
                    </form>


                </div>
        }</>

    )
}
