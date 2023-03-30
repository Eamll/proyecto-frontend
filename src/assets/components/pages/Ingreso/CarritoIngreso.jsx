import { useState } from 'react';
import { Link } from 'react-router-dom';

export const CarritoIngreso = ({ catalogos, setCatalogos }) => {
    const [cart, setCart] = useState([]);


    const addToCart = (catalogo) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === catalogo.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === catalogo.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...catalogo, quantity: 1 }];
            }
        });
    };


    return (
        <>

            <section className="cart">
                <h2>Carrito</h2>
                {cart.map((cartItem) => (
                    <div className="cart-item" key={cartItem.id}>
                        <h4 className="title">{cartItem.nombre}</h4>
                        <p>Cantidad: {cartItem.quantity}</p>
                    </div>
                ))}
            </section>



            {catalogos.map((catalogo) => (
                <article className="product-item" key={catalogo.id}>
                    <h3 className="title">
                        <Link to={'/editar-catalogo/' + catalogo.id}>{catalogo.nombre}</Link>
                    </h3>
                    <p className="codigo">Código interno: {catalogo.codigo_interno}</p>
                    <p className="cantidad">Cantidad Actual: 0</p>
                    <button className="add-to-cart" onClick={() => addToCart(catalogo)}>
                        Añadir al carrito
                    </button>

                </article>
            ))}

        </>
    );
};
