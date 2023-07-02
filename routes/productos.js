const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos,validarArchivoSubir, esAdminRole } = require('../middlewares');

const { crearProducto,
        crearMultiplesProducto,
        obtenerProductos,
        obtenerProducto,
        obtenerProductoPorNombre,
        obtenerProductoCategoria,
        actualizarProducto, 
        borrarProducto,
        //Metodos Proxy Productos 
        maestroProductosCasagri,
        stockProductosCasagri,
        ImagenProductosCasagri,
    } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


//obetener todos los productos Casagri
router.get('/maestrosCasagri', maestroProductosCasagri );

//obetener productos disponibles Casagri
router.get('/stockCasagri', stockProductosCasagri );

//obetener productos disponibles Casagri
router.get('/imagenProductosCasagri', ImagenProductosCasagri );






//  Obtener todas las categorias - publico
router.get('/', obtenerProductos );

// Obtener una categoria por id - publico
router.get('/codigo/:CodigoProd',[
    //check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeProductoPorId ),
    //validarCampos,
], obtenerProducto );

router.get('/nombreProducto/:nombre_interno',[
    //check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProductoPorNombre );

// Obtener producto por categoria
router.get('/categoria/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('categoria').custom( existeProductoPorId ),
    validarCampos,
], obtenerProductoCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    validarArchivoSubir,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    //check('categoria','No es un id de Mongo').isMongoId(),
    //check('categoria').custom( existeCategoriaPorId ),
    //validarCampos
], crearProducto );


router.post('/crearMultipleProducto', [ 
    validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearMultiplesProducto );




// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);


module.exports = router;