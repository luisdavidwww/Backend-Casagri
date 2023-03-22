const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole, validarArchivoSubirTotal, validarArchivoSubir } = require('../../middlewares');

const { crearSubCategoria,
        obtenerSubCategorias,
        filtrarSubCategorias,
        obtenerCategoria,
        obtenerCategoriaPorNombre,
        actualizarCategoria, 
        borrarCategoria } = require('../../controllers/Categoria/sub-categoria');

const { existeCategoriaPorId,
        existeSubCategoriaPorIdNombre,
        existeCategoriaPorNombre, 
        existeSubCategoriaPorId,
        existeSubCategoriaPorNombre } = require('../../helpers/db-validators');

const router = Router();


//--------------------OBTENER LISTADO DE SUB-CATEGORIAS---------------------------//
router.get('/', obtenerSubCategorias );


//--------------------OBTENER SUB-CATEGORIA POR ID---------------------------//
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeSubCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

//--------------------OBTENER SUB-CATEGORIA POR NOMBRE---------------------------//
router.get('/busca/:nombre',[
    validarCampos,
], obtenerCategoriaPorNombre );

//--------------------FILTRAR SUB-CATEGORIAS POR CATEGORIAS---------------------------//
router.get('/categoria/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], filtrarSubCategorias );

//-------------------- CREAR SUB-CATEGORIA ---------------------------//
router.post('/', [ 
    //validarJWT,
    validarArchivoSubirTotal,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], crearSubCategoria );

//-------------------- ACTUALIZAR SUB-CATEGORIA --------------------------- //
router.put('/:id',[
    //validarJWT,
    validarArchivoSubirTotal,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('id').custom( existeSubCategoriaPorId ),
    check('categoria').custom( existeCategoriaPorId ),
    //check('nombre').custom( existeSubCategoriaPorNombre ),
    validarCampos
], actualizarCategoria );

//-------------------- ELIMINAR CATEGORIA ---------------------------//
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeSubCategoriaPorId ),
    validarCampos,
],borrarCategoria);



module.exports = router;