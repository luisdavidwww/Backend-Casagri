const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../../middlewares');

const { crearLineasProductos,
        obtenerLineasProductos,
        obtenerLineaProducto,
        actualizarLineaProducto, 
        borrarLineaProducto } = require('../../controllers/Categoria/linea-producto');
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

//-------------------- ELIMINAR LINEA DE PRODUCTO ---------------------------//
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], borrarLineaProducto );



module.exports = router;