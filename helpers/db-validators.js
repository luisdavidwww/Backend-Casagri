const Role = require('../models/role');
const { Usuario, Categoria, SubCategoria, Producto, AcercaCasagri, Nosotros, Banners } = require('../models');



const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}



//--------------------  USUARIO ---------------------------//
const existeUsuarioPorId = async( id ) => {

    // Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


//-------------------- CATEGORIA ---------------------------//
//categoria por id
const existeCategoriaPorId = async( id ) => {
    // Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
//categoria por nombre
const existeCategoriaPorNombre = async( nombre ) => {
    // Verificar si la categoria existe
    const existeCategoria = await Categoria.findOne(nombre);
    if ( !existeCategoria ) {
        throw new Error(`La categoria ${ nombre }, ya existe`);
    }
}
//subcategoria por id
const existeSubCategoriaPorId = async( id ) => {
    // Verificar si la categoria existe
    const existeSubCategoria = await SubCategoria.findById(id);
    if ( !existeSubCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


//-------------------- PRODUCTOS ---------------------------//
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
const existeProductoPorCategoria = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}




//-------------------- SECCIÓN EMPRESA ---------------------------//
// Acerca Casagri
const existeAcercaCasagriPorId = async( id ) => {
    // Verificar si existe el registro solicitado
    const existeAcercaCasagri = await AcercaCasagri.findById(id);
    if ( !existeAcercaCasagri ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
// Nosotros
const existeNosotrosPorId = async( id ) => {
    // Verificar si existe el registro solicitado
    const nosotros = await Nosotros.findById(id);
    if ( !nosotros ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


//-------------------- BANNERS PRINCIPALES ---------------------------//
// Banner por id
const existeBannersPorId = async( id ) => {
    // Verificar si existe el Banner
    const banners = await Banners.findById(id);
    if ( !banners ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
// Banner por nombre
const existeBannersPorNombre = async( nombre_interno ) => {
    // Verificar si existe el Banner
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
    //Metodos Usuario
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,

    //Metodos Categoria
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeSubCategoriaPorId,

    //Metodos Producto
    existeProductoPorId,
    existeProductoPorCategoria,

    //Metodos Sección Empresa
    existeAcercaCasagriPorId,
    existeNosotrosPorId,

    //Metodos Banners
    existeBannersPorId,
    existeBannersPorNombre,
    coleccionesPermitidas
}

