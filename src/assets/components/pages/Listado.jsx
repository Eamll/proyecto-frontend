
import { Link } from 'react-router-dom';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo } from '../../helpers/Global';

export const Listado = ({ catalogos, setProducts: setCatalogos }) => {
    const eliminar = async (id) => {
        setCatalogos(prevProducts => prevProducts.map(product => {
            if (product.id === id) {
                return { ...product, deleting: true };
            }
            return product;
        }));
        let { datos } = await PeticionAjax(GlobalCatalogo.url + "catalogo/" + id, "DELETE");
        if (datos.status === "success") {
            setCatalogos(prevProducts => prevProducts.filter(product => product.id !== id));
        }
    }

    return (
        catalogos.map(catalogo => {
            return (
                <article className="product-item" key={catalogo.id}>
                    <div className='datos'>
                        <h1>{catalogo.id}</h1>
                        <h3 className="title"><Link to={"/editar-catalogo/" + catalogo.id}>{catalogo.nombre}</Link></h3>
                        <p className="codigo">Código interno: {catalogo.codigo_interno}</p>
                        <p className="codigo_de_barras">Código de barras: {catalogo.codigo_de_barras}</p>
                        <p className="activo">Activo: {catalogo.activo ? 'Sí' : 'No'}</p>
                        <p className="description">{catalogo.descripcion}</p>
                        <Link to={"/editar-catalogo/" + catalogo.id}><button className="edit">Editar</button></Link>
                        {catalogo.deleting ? <button className='delete'>Borrando...</button> : <button className="delete" onClick={() => { eliminar(catalogo.id) }}>Borrar</button>}
                    </div>
                </article>
            );
        })
    )

}
