import React, { useState } from 'react';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { Message } from '../common/Message';


export const CrearCatalogo = () => {
    const { formulario, enviado, cambiado } = useForm({});
    const [resultado, setResultado] = useState("No enviado");

    const handleSubmit = async (event) => {
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
            <form onSubmit={handleSubmit}>
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
                <label>Descripción:
                    <input type="text" name="descripcion" onChange={cambiado} />
                </label>
                <br />
                <label>Activo:
                    <input type="checkbox" name="activo" onChange={cambiado} />
                </label>
                <br />
                <button type="submit">Crear producto</button>
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


