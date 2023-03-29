
import { Link } from 'react-router-dom';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalCatalogo } from '../../helpers/Global';

export const Listado = ({ catalogos, setCatalogos }) => {
    const eliminar = async (id) => {
        setCatalogos(prevCatalogos => prevCatalogos.map(catalogo => {
            if (catalogo.id === id) {
                return { ...catalogo, deleting: true };
            }
            return catalogo;
        }));
        let { datos } = await PeticionAjax(GlobalCatalogo.url + "id/" + id, "DELETE");
        if (datos.status === "success") {
            setCatalogos(prevCatalogos => prevCatalogos.filter(catalogo => catalogo.id !== id));
        }
    }

    return (
        catalogos.map(catalogo => {
            return (
                <article className="product-item" key={catalogo.id}>
                    <div className='datos'>
                        {/* <h1>{catalogo.id}</h1> */}
                        <h3 className="title"><Link to={"/editar-catalogo/" + catalogo.id}>{catalogo.nombre}</Link></h3>
                        <p className="codigo">Código interno: {catalogo.codigo_interno}</p>
                        <p className="cantidad">Cantidad Actual: 0</p>
                        {/* <p className="codigo_de_barras">Código de barras: {catalogo.codigo_de_barras}</p> */}
                        {/* <p className="codigo_proveedor">Código de proveedor: {catalogo.codigo_proveedor}</p> */}
                        {/* <p className="activo">Activo: {catalogo.activo === 'A' ? 'Sí' : 'No'}</p> */}
                        {/* <p className="description">{catalogo.descripcion}</p> */}
                        <Link to={"/editar-catalogo/" + catalogo.id}><button className="edit">Editar</button></Link>
                        {catalogo.deleting ? <button className='delete'>Borrando...</button> : <button className="delete" onClick={() => { eliminar(catalogo.id) }}>Borrar</button>}
                    </div>
                </article>
            );
        })
    )

}
