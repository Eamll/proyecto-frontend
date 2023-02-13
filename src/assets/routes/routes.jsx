import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Inicio } from '../components/pages/Inicio'
import { Header, Nav, Footer } from '../components/Layouts/layouts'
export const Rutas = () => {
    return (
        <BrowserRouter>
            {/**Layoute */}
            <Header />
            <Nav />
            {/**Contenido central y rutas*/}
            <section id="content" className='content'>
                <Routes>
                    <Route path='/' element={<Inicio />} />
                    <Route path='/inicio' element={<Inicio />} />

                    <Route path='*' element={
                        <div className='jumbo'>
                            Error 404
                        </div>
                    } />
                </Routes>
            </section>

            <Footer />
        </BrowserRouter>
    );
}