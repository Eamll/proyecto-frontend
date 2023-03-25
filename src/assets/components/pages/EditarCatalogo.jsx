import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const EditarCatalogo = () => {
    const { formulario, enviado, cambiado } = useForm({});
    const [resultado, setResultado] = useState("No enviado");
    const [producto, setProducto] = useState([]);
    const [cargando, setCargando] = useState(true);
    const params = useParams();
    useEffect(() => {
        conseguirProducto();
    }, [])
    const conseguirProducto = async () => {
        const { datos } = await PeticionAjax(GlobalCatalogo.url + "producto/" + params.id, "GET");
        if (datos.status === "success") {
            setProducto(datos.productoActualizado);
        }
        setCargando(false);
    }


    const editarProducto = async (e) => {
        e.preventDefault()
        let nuevoProducto = formulario;
        const { datos } = await PeticionAjax(GlobalCatalogo.url + "producto/" + params.id, "PUT", nuevoProducto);
        if (datos.status === "success") {
            setResultado("Guardado");
            // const formData = new FormData();
            // const subida = await PeticionAjax(Global.url + "subir-imagen/" + datos.articulo._id, "POST", formData, true);

            // if (subida.datos.status === "success") {
            //     setResultado("Guardado");
            // } else {
            //     setResultado("Error");
            // }
        } else {
            setResultado("Error");
        }

    }
    return (
        <>{
            cargando ? "Cargando" :
                <div className='jumbo'>
                    <h1>Editar Producto</h1>
                    <p>Formulario para editar: {producto.nombre}</p>
                    {/* <pre>{JSON.stringify(formulario)}</pre> */}
                    <strong>{resultado == "Guardado" ? "Producto guardado con exito" : ""}</strong>
                    <strong>{resultado == "Error" ? "Datos proporcionados son incorrectos" : ""}</strong>
                    {/*Montar formulario*/}
                    <form className='formulario' onSubmit={editarProducto}>
                        <div className='form-group'>
                            <label htmlFor='nombre'>Nombre:</label>
                            <input type="text" name='nombre' onChange={cambiado} defaultValue={producto.nombre} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='codigo'>Código:</label>
                            <input type="text" name='codigo' onChange={cambiado} defaultValue={producto.codigo} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='codigo_de_barras'>Código de barras:</label>
                            <input type="text" name='codigo_de_barras' onChange={cambiado} defaultValue={producto.codigo_de_barras} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='descripcion'>Descripción:</label>
                            <input type="text" name='descripcion' onChange={cambiado} defaultValue={producto.descripcion} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='activo'>Activo:</label>
                            <input type="checkbox" name='activo' onChange={cambiado} defaultChecked={producto.activo} />
                        </div>

                        <input type="submit" value="Guardar" className='btn btn-success' />
                    </form>


                </div>
        }</>

    )
}
