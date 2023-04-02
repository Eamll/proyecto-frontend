import React from 'react';
import { useNavigate } from 'react-router-dom';

function MenuIngreso() {
    const navigate = useNavigate();

    function handleButton1Click() {
        navigate('/ingreso-compra');
    }

    function handleButton2Click() {
        navigate('/crear-ingreso');
    }

    return (
        <div>
            <h1>Operación a realizar:</h1>
            <button onClick={handleButton1Click}>Ingreso por compra</button>
            <button onClick={handleButton2Click}>Ingreso manual</button>
        </div>
    );
}

export default MenuIngreso;
