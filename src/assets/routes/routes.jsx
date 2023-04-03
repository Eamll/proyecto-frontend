import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Inicio } from '../components/pages/Inicio'
import { Header, Nav, Footer } from '../components/Layouts/layouts'
import { ListaCatalogos } from '../components/pages/ListaCatalogos'
import { EditarCatalogo } from '../components/pages/EditarCatalogo'

import { Sidebar } from '../components/layouts/Sidebar'
import { LoginComponent } from '../components/pages/Login'
import PrivateRoute from './PrivateRoute'
import { isTokenExpired } from '../helpers/auth'
import { MaestroIngreso } from '../components/pages/Ingreso/MaestroIngreso'
import { IngresoPorCompra } from '../components/pages/Ingreso/IngresoPorCompra'
import MenuIngreso from '../components/pages/Ingreso/MenuIngreso'
import { CrearIngresoPorCompra } from '../components/pages/Ingreso/CrearIngresoPorCompra'
import { MaestroSalida } from '../components/pages/Salida/MaestroSalida'
import { MaestroTraspaso } from '../components/pages/Traspaso/MaestroTraspaso'
import { MaestroAjuste } from '../components/pages/Ajuste/MaestroAjuste'
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
            {(location.pathname === "/catalogos" || location.pathname === "/crear-ingreso" || location.pathname === "/ingreso-compra" || location.pathname === "/crear-salida" || location.pathname === "/crear-traspaso" || location.pathname === "/crear-ajuste") && (
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

                    <Route path="/editar-catalogo/:id" element={<PrivateRoute><EditarCatalogo /></PrivateRoute>} />
                    <Route path="/crear-ingreso" element={<PrivateRoute><MaestroIngreso searchQuery={searchQuery} /></PrivateRoute>} />
                    <Route path="/ingreso-compra" element={<PrivateRoute><IngresoPorCompra searchQuery={searchQuery} /></PrivateRoute>} />
                    <Route path="/menu-ingreso" element={<PrivateRoute><MenuIngreso /></PrivateRoute>} />
                    <Route path="/compra/:id" element={<PrivateRoute><CrearIngresoPorCompra /></PrivateRoute>} />
                    <Route path="/crear-salida" element={<PrivateRoute><MaestroSalida searchQuery={searchQuery} /></PrivateRoute>} />
                    <Route path="/crear-traspaso" element={<PrivateRoute><MaestroTraspaso searchQuery={searchQuery} /></PrivateRoute>} />
                    <Route path="/crear-ajuste" element={<PrivateRoute><MaestroAjuste searchQuery={searchQuery} /></PrivateRoute>} />

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