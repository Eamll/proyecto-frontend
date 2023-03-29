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
                <label>Nombre:
                    <input type="text" name="nombre" onChange={cambiado} />
                </label>
                <br />
                <label>Código interno:
                    <input type="text" name="codigo_interno" onChange={cambiado} />
                </label>
                <br />
                <label>Código de barras:
                    <input type="text" name="codigo_de_barras" onChange={cambiado} />
                </label>
                <br />
                <label>Código de provedor:
                    <input type="text" name="codigo_proveedor" onChange={cambiado} />
                </label>
                <br />
                <label>Descripción:
                    <input type="text" name="descripcion" onChange={cambiado} />
                </label>
                <br />
                <label>Activo:
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
                </label>
                <br />
                <label>
                    Unidad de medida:
                    <select name="id_unidad_medida" onChange={cambiado} >
                        <option value="">Unidad de medida: </option>
                        {unidadMedidas && unidadMedidas.map((unidadMedida) => (
                            <option key={unidadMedida.id} value={unidadMedida.id}>
                                {unidadMedida.id}-{unidadMedida.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Tipo de catálogo:
                    <select name="id_tipo_catalogo" onChange={cambiado} >
                        <option value="">Tipo de Catalogo: </option>
                        {tipoCatalogos && tipoCatalogos.map((tipoCatalogo) => (
                            <option key={tipoCatalogo.id} value={tipoCatalogo.id}>
                                {tipoCatalogo.id}-{tipoCatalogo.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Subcategoria:
                    <select name="id_subcategoria" onChange={cambiado} >
                        <option value="">Subcategoria: </option>
                        {subCategorias && subCategorias.map((subcategoria) => (
                            <option key={subcategoria.id} value={subcategoria.id}>
                                {subcategoria.id}-{subcategoria.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <br />
                <button type="submit">Crear catalogo</button>
                <br />
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


