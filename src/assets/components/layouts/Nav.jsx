import React from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {
    return (
        <nav className="nav">
            <ul>
                <li><NavLink to="/inicio">Crear Catalogo</NavLink></li>
                <li><NavLink to="/catalogos">Catalogos</NavLink></li>
                <li><NavLink to="/menu-ingreso">Ingreso</NavLink></li>

            </ul>
        </nav>
    )
}
