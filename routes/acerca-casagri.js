
const { Router } = require('express');
const { check } = require('express-validator');


//--------------------MIDDLEWARES---------------------------//
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeAcercaCasagriPorId } = require('../helpers/db-validators');

const { acercaCasagriGet,
        acercaCasagriPost,
        acercaCasagriPut,
        acercaCasagriDelete
       } = require('../controllers/acerca-casagri');

const router = Router();



//--------------------OBTENER LISTADO---------------------------//
router.get('/', acercaCasagriGet );


//--------------------CREAR REGISTRO---------------------------//
router.post('/',[
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos
], acercaCasagriPost );

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeAcercaCasagriPorId ),
    validarCampos
], acercaCasagriPut );

//--------------------ELIMINAR REGISTRO---------------------------//
router.delete('/:id',[
    //validarJWT,
    //tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeAcercaCasagriPorId ),
    validarCampos
], acercaCasagriDelete );





module.exports = router;