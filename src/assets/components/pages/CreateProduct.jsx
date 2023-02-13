import React, { useState } from 'react';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { Global } from '../../helpers/Global';
import Message from '../common/Message';

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        descripcion: '',
        monto: '',
    });
    const [resultado, setResultado] = useState("No enviado");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);
        // Send the data to the database using fetch or axios
        //Recoger datos del formulario
        let newData = formData;
        //Guardar articulo en el backend
        const { datos } = await PeticionAjax(Global.url + "insertar", "POST", newData);
        if (datos.status === "success") {
            setResultado("Guardado");
        } else {
            setResultado("Error");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>

                <label>
                    Id:
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Descripción:
                    <input
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Monto:
                    <input
                        type="text"
                        name="monto"
                        value={formData.monto}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Crear producto</button>
                <br />


                {/* {console.log(resultado)} */}
            </form>

            {formSubmitted && resultado !== 'No enviado' && (
                <>
                    <br />
                    <Message resultado={resultado} setResultado={setResultado} />
                </>
            )

            }

        </>

    );
};

export default CreateProduct;
