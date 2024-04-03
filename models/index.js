
// CATEGORIA //
const Categoria         = require('./Categoria/categoria');
const SubCategoria    = require('./Categoria/sub-categoria');
const LineaProductos    = require('./Categoria/linea-producto');

// SECCION EMPRESA //
const AcercaCasagri  = require('./Empresa/acerca-casagri');
const Nosotros  = require('./Empresa/nosotros');
const Trayectoria  = require('./Empresa/trayectoria');

// SERVER //
const Server   = require('./server');

// USUARIO //
const Role     = require('./role');
const Usuario  = require('./usuario');

// PRODUCTO  //
const Producto = require('./producto');
const ProductoR = require('./Productos/productoR');

// BANNERS //
const Banners  = require('./Banners/banners');

const Documento         = require('./Documentos/documento');


const ChatMensajes = require('./chat-mensajes')




module.exports = {
    Categoria,
    LineaProductos,
    SubCategoria,
    ChatMensajes,
    Producto,
    ProductoR,
    Role,
    Server,
    Usuario,
    AcercaCasagri,
    Nosotros,
    Trayectoria,
    Banners,
    Documento
}

