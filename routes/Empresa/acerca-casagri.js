
const { Router } = require('express');
const { check } = require('express-validator');


//--------------------MIDDLEWARES---------------------------//
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../../middlewares');


const { esRoleValido, emailExiste, existeAcercaCasagriPorId, existeAcercaCasagriPorNombre } = require('../../helpers/db-validators');

const { acercaCasagriGet,
        acercaCasagriPost,
        acercaCasagriPut,
        acercaCasagriDelete
       } = require('../../controllers/Empresa/acerca-casagri');

const router = Router();



//--------------------OBTENER LISTADO---------------------------//
router.get('/', acercaCasagriGet );


//--------------------CREAR REGISTRO---------------------------//
router.post('/',[
    //validarJWT,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    check('titulo').custom( existeAcercaCasagriPorNombre ),
    validarCampos
], acercaCasagriPost );

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeAcercaCasagriPorId ),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos
], acercaCasagriPut );

//--------------------ELIMINAR REGISTRO---------------------------//
router.delete('/:id',[
    //validarJWT,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeAcercaCasagriPorId ),
    validarCampos
], acercaCasagriDelete );





module.exports = router;