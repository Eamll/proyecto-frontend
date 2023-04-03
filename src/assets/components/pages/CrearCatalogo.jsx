import React, { useEffect, useState } from 'react';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo, GlobalSubcategoria, GlobalTipoCatalogo, GlobalUnidadMedida } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { Message } from '../common/Message';


export const CrearCatalogo = () => {
    const { formulario, enviado, cambiado } = useForm({});
    const [resultado, setResultado] = useState("No enviado");
    const [unidadMedidas, setUnidadMedidas] = useState([]);
    const [tipoCatalogos, setTipoCatalogos] = useState([]);
    const [subCategorias, setSubcategorias] = useState([]);


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

    useEffect(() => {
        const myElement = document.getElementById('layout_pagina');
        myElement.className = 'layout_inicio';
        fetchUnidadMedidas();
        fetchTipoCatalogos();
        fetchSubcategorias();
        // console.log(formulario);
    }, []);



    const crearCatalogo = async (event) => {
        event.preventDefault();
        //Recoger datos del formulario
        let nuevoCatalogo = formulario;
        //Guardar articulo en el backend
        const { datos } = await PeticionAjax(GlobalCatalogo.url + "crear", "POST", nuevoCatalogo);
        if (datos.status === "success") {
            setResultado("Guardado");

        } else {
            setResultado("Error");
        }

    };

    return (
        <>
            <form onSubmit={crearCatalogo}>
                <div className='div_flex_centro'>
                    <div className='alinea_derecha'>
                        <div>
                            <div>

                                <label>Nombre:</label>
                            </div>
                            <div>
                                <input type="text" name="nombre" onChange={cambiado} />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Código interno:</label>
                            </div>
                            <div>
                                <input type="text" name="codigo_interno" onChange={cambiado} />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Código de barras:</label>
                            </div>
                            <div>
                                <input type="text" name="codigo_de_barras" onChange={cambiado} />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Código de provedor:</label>
                            </div>
                            <div>
                                <input type="text" name="codigo_proveedor" onChange={cambiado} />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Descripción:</label>
                            </div>
                            <div>
                                <input type="text" name="descripcion" onChange={cambiado} />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Activo:</label>
                                <input
                                    type="checkbox"
                                    name="activo"
                                    onChange={(event) => {
                                        cambiado({
                                            target: {
                                                name: event.target.name,
                                                value: event.target.checked ? "A" : "I",
                                            },
                                        });
                                    }}
                                    defaultChecked={true}
                                />
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Unidad de medida:</label>
                            </div>

                            <div>
                                <select name="id_unidad_medida" onChange={cambiado} >
                                    <option value="">Unidad de medida: </option>
                                    {unidadMedidas && unidadMedidas.map((unidadMedida) => (
                                        <option key={unidadMedida.id} value={unidadMedida.id}>
                                            {unidadMedida.id}-{unidadMedida.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Tipo de catálogo:</label>
                            </div>
                            <div>
                                <select name="id_tipo_catalogo" onChange={cambiado} >
                                    <option value="">Tipo de Catalogo: </option>
                                    {tipoCatalogos && tipoCatalogos.map((tipoCatalogo) => (
                                        <option key={tipoCatalogo.id} value={tipoCatalogo.id}>
                                            {tipoCatalogo.id}-{tipoCatalogo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>

                                <label>Subcategoria:</label>
                            </div>
                            <div>
                                <select name="id_subcategoria" onChange={cambiado} >
                                    <option value="">Subcategoria: </option>
                                    {subCategorias && subCategorias.map((subcategoria) => (
                                        <option key={subcategoria.id} value={subcategoria.id}>
                                            {subcategoria.id}-{subcategoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit">Crear catalogo</button>
                </div>

            </form>
            {resultado !== 'No enviado' && (
                <>
                    <br />
                    <Message resultado={resultado} setResultado={setResultado} />
                </>
            )
            }
        </>
    );
};


