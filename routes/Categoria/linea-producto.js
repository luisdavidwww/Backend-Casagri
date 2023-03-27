const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../../middlewares');

const { crearLineasProductos,
        obtenerLineasProductos,
        obtenerLineaProductoPorNombre,
        obtenerLineaPorNombre,
        obtenerLineaProducto,
        actualizarLineaProducto, 
        } = require('../../controllers/Categoria/linea-producto');
        
const { existeCategoriaPorId, existeLineaProductoPorNombre, existeLineaProductoPorId } = require('../../helpers/db-validators');

const router = Router();


//-------------------- OBTENER LISTADO LINEA DE PRODUCTO ---------------------------//
router.get('/', obtenerLineasProductos );

//-------------------- OBTENER 1 LINEA DE PRODUCTO ---------------------------//
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeLineaProductoPorId ),
    validarCampos,
], obtenerLineaProducto );

//-------------------- OBTENER 1 LINEA DE PRODUCTO por Nombre ---------------------------//
router.get('/buscarBanner/:nombre_interno',[
    validarCampos,
], obtenerLineaProductoPorNombre );

//-------------------- OBTENER 1 LINEA DE PRODUCTO por Nombre ---------------------------//
router.get('/buscarLinea/:nombre',[
    validarCampos,
], obtenerLineaPorNombre );

//-------------------- CREAR LINEA DE PRODUCTO ---------------------------//
router.post('/', [ 
    //validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('subcategoria','La subcategoria es obligatorio').not().isEmpty(),
    check('nombre').custom( existeLineaProductoPorNombre ),
    validarCampos
], crearLineasProductos );

//-------------------- ACTUALIZAR LINEA DE PRODUCTO ---------------------------//
router.put('/:id',[
    //validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('subcategoria','La subcategoria es obligatorio').not().isEmpty(),
    check('id').custom( existeLineaProductoPorId ),
    validarCampos
], actualizarLineaProducto );





module.exports = router;