import { Carrito } from "./Carrito";



export const ListadoAIngresar = ({ catalogos, onAddToCart }) => {
    return (
        catalogos.map((catalogo) => {
            return (
                <article className="articulo" key={catalogo.id}>
                    <Carrito
                        catalogo={catalogo}
                        onAddToCart={onAddToCart}
                        cantidad={catalogo.cantidad}
                        costo_unitario={catalogo.costo_unitario}
                    />
                </article>
            );
        })
    );
};
