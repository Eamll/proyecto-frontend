import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Inicio } from '../components/pages/Inicio'
import { Header, Nav, Footer } from '../components/Layouts/layouts'
import { ListaCatalogos } from '../components/pages/ListaCatalogos'
import { EditarCatalogo } from '../components/pages/EditarCatalogo'
import { CrearInventario } from '../components/pages/Inventario/CrearInventario'
import { Sidebar } from '../components/layouts/Sidebar'
import { CrearIngreso } from '../components/pages/Ingreso/CrearIngreso'
import { LoginComponent } from '../components/pages/Login'

const ContentWithSidebar = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    }
    return (
        <>
            {location.pathname === "/catalogos" && (
                <Sidebar
                    searchQuery={searchQuery}
                    handleSearchQueryChange={handleSearchQueryChange}
                />
            )}
            <section id="content" className="content">
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/catalogos" element={<ListaCatalogos searchQuery={searchQuery} />} />
                    <Route path="/inventario" element={<CrearInventario />} />
                    <Route path="/editar-catalogo/:id" element={<EditarCatalogo />} />
                    <Route path="/crear-ingreso" element={<CrearIngreso />} />

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