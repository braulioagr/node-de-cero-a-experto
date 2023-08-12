import { Categoria, Role, Usuario, Producto } from '../models/index.js'

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
    return true;
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
    return true;
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
    return true;
}

const existeCategoriaPorId = async( id ) => {

    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
    return true;
}
const existeProductoPorId = async( id ) => {

    const existeProducto= await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
    return true;
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    // Validar Colecciones Permintidas
    const estaIncluida =  colecciones.includes(coleccion);
    if ( !estaIncluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida ${colecciones}`);
    }
    return true;
}

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}