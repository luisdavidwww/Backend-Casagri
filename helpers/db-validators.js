const Role = require('../models/role');
const { Usuario, Categoria, Producto, AcercaCasagri, Nosotros, Banners } = require('../models');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Categorias
 */
const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Productos por categoria
 */
const existeProductoPorCategoria = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * AcercaCasagri
 */

const existeAcercaCasagriPorId = async( id ) => {
    // Verificar si el correo existe
    const existeAcercaCasagri = await AcercaCasagri.findById(id);
    if ( !existeAcercaCasagri ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Nosotros
 */

const existeNosotrosPorId = async( id ) => {
    // Verificar si el correo existe
    const nosotros = await Nosotros.findById(id);
    if ( !nosotros ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Banners
 */

const existeBannersPorId = async( id ) => {
    // Verificar si el correo existe
    const banners = await Banners.findById(id);
    if ( !banners ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Banners
 */

const existeBannersPorNombre = async( nombre_interno ) => {
    // Verificar si el correo existe
    const banners = await Banners.findOne({nombre_interno});
    if ( !banners ) {
        throw new Error(`El banner ${ nombre_interno }  no existe`);
    }
}






/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existeProductoPorCategoria,
    existeAcercaCasagriPorId,
    existeNosotrosPorId,
    existeBannersPorId,
    existeBannersPorNombre,
    coleccionesPermitidas
}

