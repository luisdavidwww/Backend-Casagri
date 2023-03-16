
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarArchivoSubir,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../../middlewares');


const { esRoleValido, emailExiste, existeNosotrosPorId } = require('../../helpers/db-validators');

const { nosotrosGet,
        nosotrosPut,
        nosotrosPost,
        NosotrosDelete,
        nosotrosPatch } = require('../../controllers/Empresa/trayectoria');

const router = Router();



//--------------------OBTENER LISTADO---------------------------//
router.get('/', nosotrosGet );

//--------------------CREAR REGISTRO---------------------------//
router.post('/',[
    validarArchivoSubir,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos
], nosotrosPost );

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    validarArchivoSubir,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeNosotrosPorId ),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos
    ],nosotrosPut );

//--------------------ELIMINAR REGISTRO---------------------------//
router.delete('/:id',[
    //validarJWT,
    //tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeNosotrosPorId ),
    validarCampos
], NosotrosDelete );

router.patch('/', nosotrosPatch );





module.exports = router;