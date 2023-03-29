import { useState } from "react";


// In Sidebar.jsx
export const Sidebar = ({ searchQuery, handleSearchQueryChange }) => {
    return (
        <aside className="lateral">
            <div className="search">
                <h3 className="title">Buscador</h3>
                <input
                    type="text"
                    name="search_catalogo"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder="Buscar"
                />
            </div>
        </aside>
    );
};

