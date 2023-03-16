const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole, validarArchivoSubirTotal, validarArchivoSubir } = require('../../middlewares');

const { crearSubCategoria,
    obtenerSubCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria } = require('../../controllers/Categoria/sub-categoria');

const { existeCategoriaPorId, existeCategoriaPorNombre, existeSubCategoriaPorId } = require('../../helpers/db-validators');

const router = Router();


//--------------------OBTENER LISTADO DE SUB-CATEGORIAS---------------------------//
router.get('/', obtenerSubCategorias );

//--------------------OBTENER 1 CATEGORIAS---------------------------//
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

//-------------------- CREAR SUB-CATEGORIA ---------------------------//
router.post('/', [ 
    //validarJWT,
    validarArchivoSubirTotal,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
], crearSubCategoria );

//-------------------- ACTUALIZAR CATEGORIA --------------------------- //
router.put('/:id',[
    //validarJWT,
    validarArchivoSubir,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeSubCategoriaPorId ),
    check('categoria').custom( existeCategoriaPorId ),
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