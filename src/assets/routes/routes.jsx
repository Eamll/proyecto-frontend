import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Inicio } from '../components/pages/Inicio'
import { Header, Nav, Footer } from '../components/Layouts/layouts'
import { ListaCatalogos } from '../components/pages/ListaCatalogos'
import { EditarCatalogo } from '../components/pages/EditarCatalogo'
import { CrearInventario } from '../components/pages/Inventario/CrearInventario'
import { Sidebar } from '../components/layouts/Sidebar'
import { Ingreso } from '../components/pages/Ingreso/Ingreso'
import { LoginComponent } from '../components/pages/Login'
import PrivateRoute from './PrivateRoute'
import { isTokenExpired } from '../helpers/auth'
import { CarritoIngreso } from '../components/pages/Ingreso/CarritoIngreso'
import { CrearIngreso } from '../components/pages/Ingreso/CrearIngreso'
import { MaestroIngreso } from '../components/pages/Ingreso/MaestroIngreso'
// import ConditionalRoute from './ConditionalRoute'

const ContentWithSidebar = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const is_token_expired = isTokenExpired();


    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    }

    if (is_token_expired && location.pathname !== "/login") {
        return <Navigate to="/login" />;
    }


    return (
        <>
            {(location.pathname === "/catalogos" || location.pathname === "/crear-ingreso") && (
                <Sidebar
                    searchQuery={searchQuery}
                    handleSearchQueryChange={handleSearchQueryChange}
                />
            )}
            <section id="content" className="content">
                <Routes>

                    <Route path="/" element={<PrivateRoute><Inicio /></PrivateRoute>} />
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
                    <Route path="/catalogos" element={<PrivateRoute><ListaCatalogos searchQuery={searchQuery} /> </PrivateRoute>} />
                    <Route path="/inventario" element={<PrivateRoute><CrearInventario /></PrivateRoute>} />
                    <Route path="/editar-catalogo/:id" element={<PrivateRoute><EditarCatalogo /></PrivateRoute>} />
                    <Route path="/crear-ingreso" element={<PrivateRoute><MaestroIngreso searchQuery={searchQuery} /></PrivateRoute>} />

                    <Route path="*" element={<div className="jumbo">Error 404</div>}
                    />

                </Routes>
            </section>
        </>
    );
};


export const Rutas = () => {
    return (
        <BrowserRouter>
            {/**Layoute */}
            <Header />
            <Nav />
            {/**Contenido central y rutas*/}
            <ContentWithSidebar />
            <Footer />
        </BrowserRouter>
    );
}