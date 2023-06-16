const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos,validarArchivoSubir, esAdminRole } = require('../../middlewares');

const { 
    crearProducto,
    crearProductoTotal,
    obtenerProductos,
    obtenerProductosPaginados,
    actualizarProductoPorID,
    crearProductoConArchivoJSON,
    actualizarTodosLosProducto,
    actualizarStockLosProducto,
    actualizarProductoDrop
        } = require('../../controllers/Productos/productoGeneral');

const {  existeProductoPorId } = require('../../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico obtenerProductosPaginados
router.get('/', obtenerProductos );
router.get('/obtenerProductosPaginados', obtenerProductosPaginados );


// Crear articulo
router.post('/', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearProducto );


router.post('/crearProductoTotal', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearProductoTotal );

router.post('/subirLoteArticulo', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearProductoConArchivoJSON );


router.post('/ActualizarProductoPorID/:productoId', [ 
], actualizarProductoPorID );

router.post('/ActulizarTodosLosProductos', [ 
], actualizarTodosLosProducto );

router.post('/ActulizarStockLosProducto', [ 
], actualizarStockLosProducto );

router.post('/ActualizarProductosDrop', [ 
], actualizarProductoDrop );


module.exports = router;