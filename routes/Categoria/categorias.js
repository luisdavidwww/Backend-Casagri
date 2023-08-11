const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole, validarArchivoSubir, validarArchivoSubirPrincipal } = require('../../middlewares');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria } = require('../../controllers/Categoria/categorias');

const { existeCategoriaPorId, existeCategoriaPorNombre } = require('../../helpers/db-validators');

const router = Router();


//--------------------OBTENER LISTADO DE CATEGORIAS---------------------------//
router.get('/', obtenerCategorias );

//--------------------OBTENER 1 CATEGORIAS---------------------------
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

//-------------------- CREAR CATEGORIA ---------------------------//
router.post('/', [ 
    //validarJWT,
    //validarArchivoSubir,
    validarArchivoSubirPrincipal,
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    check('nombre').custom( existeCategoriaPorNombre ),
    validarCampos,
], crearCategoria );

//-------------------- ACTUALIZAR CATEGORIA ---------------------------//
router.put('/:id',[
    //validarJWT,
    validarArchivoSubirPrincipal,
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    //check('nombre').custom( existeCategoriaPorNombre ),
    validarCampos
], actualizarCategoria );

//-------------------- ELIMINAR CATEGORIA ---------------------------//
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],borrarCategoria);



module.exports = router;