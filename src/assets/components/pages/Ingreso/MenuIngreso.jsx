import React from 'react';
import { useNavigate } from 'react-router-dom';

function MenuIngreso() {
    const myElement = document.getElementById('layout_pagina');
    myElement.className = 'layout_menu_ingreso';
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
            <div className='menu_ingreso'>
                <div>

            <button onClick={handleButton1Click}>Ingreso por compra</button>
                </div>
                <div>
            <button onClick={handleButton2Click}>Ingreso manual</button>

                </div>
            </div>
        </div>
    );
}

export default MenuIngreso;
