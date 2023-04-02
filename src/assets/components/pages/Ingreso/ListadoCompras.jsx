import { Link } from "react-router-dom";


export const ListadoCompras = ({ compras, setCompras }) => {

    return (
        <>
            {compras.map((compra) => (
                <Link to={`/compra/${compra.id}`} key={compra.id}>
                    <article className="product-item">
                        <div className="datos">
                            <h1>{compra.id}</h1>
                            <h1>{compra.personal.contacto.nombre} {compra.personal.contacto.apellido_paterno} {compra.personal.contacto.apellido_materno}</h1>

                            <h1>{compra.almacen.nombre}</h1>
                            <p className="fecha">Fecha: {compra.fecha}</p>
                            <p className="tipo_pago">Tipo de Pago: {compra.tipo_pago}</p>
                            <p className="proveedor">Proveedor : {compra.proveedor.razon_social}</p>
                        </div>
                    </article>
                </Link>
            ))}
        </>
    );
};
