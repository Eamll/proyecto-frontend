import { Link } from 'react-router-dom';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { debounce } from '../../helpers/Debounce';
import { GlobalCatalogo } from '../../helpers/Global';
import { useSnackbar } from '../../hooks/useSnackbar';
import Snackbar from '../common/SnackBar';

export const Listado = ({ catalogos, setCatalogos }) => {
    const [snackbar, showSnackbar] = useSnackbar();
    const eliminar = async (id) => {
        setCatalogos((prevCatalogos) =>
            prevCatalogos.map((catalogo) => {
                if (catalogo.id === id) {
                    return { ...catalogo, deleting: true };
                }
                return catalogo;
            })
        );
        try {
            let { datos } = await PeticionAjax(GlobalCatalogo.url + 'id/' + id, 'DELETE');
            if (datos.status === 'success') {
                setCatalogos((prevCatalogos) => prevCatalogos.filter((catalogo) => catalogo.id !== id));
            } else {
                throw new Error(datos.message); // throw error if status is not "success"
            }
        } catch (error) {
            showSnackbar('error', error.message);
            setCatalogos((prevCatalogos) =>
                prevCatalogos.map((catalogo) => {
                    if (catalogo.id === id) {
                        const { deleting, ...updatedCatalogo } = catalogo; // remove the "deleting" attribute
                        return updatedCatalogo;
                    }
                    return catalogo;
                })
            );
        }
    };
    const debouncedEliminar = debounce(eliminar, 300);

    return (
        <>
            {catalogos.map((catalogo) => (
                <article className="product-item" key={catalogo.id}>
                    <div className="datos">
                        {/* <h1>{catalogo.id}</h1> */}
                        <h3 className="title">
                            <Link to={'/editar-catalogo/' + catalogo.id}>{catalogo.nombre}</Link>
                        </h3>
                        <p className="codigo"> {catalogo.codigo_interno}</p>
                        <p className="cantidad">Cantidad Actual: 0</p>
                        <Link to={'/editar-catalogo/' + catalogo.id}>
                            <button className="edit">Editar</button>
                        </Link>
                        {catalogo.deleting ? (
                            <button className="delete">Borrando...</button>
                        ) : (
                            <button className="delete" onClick={() => debouncedEliminar(catalogo.id)}>
                                Borrar
                            </button>
                        )}
                    </div>
                </article>
            ))}
            <Snackbar show={snackbar.show} type={snackbar.type} message={snackbar.message} />
        </>
    );
};
