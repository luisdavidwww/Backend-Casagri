const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos,validarArchivoSubir, esAdminRole } = require('../middlewares');

const { 
    obtenerArticulos,
    crearArticulo,
    crearArticuloListado,
    actualizarArticuloDrop
        } = require('../controllers/articulo');

const {  existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerArticulos );


// Crear articulo
router.post('/', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearArticulo );

router.post('/subirLoteArticulo', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearArticuloListado );

router.post('/ProductosDisponibles', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], actualizarArticuloDrop );



module.exports = router;