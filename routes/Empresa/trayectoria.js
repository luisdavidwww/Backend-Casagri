
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarArchivoSubir,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../../middlewares');


const { esRoleValido, emailExiste, existeTrayectoriaPorId, existeTrayectoriaPorNombre } = require('../../helpers/db-validators');

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
    //validarJWT,
    //check('titulo', 'El titulo debe de ser más de 6 letras').isLength({ min: 6 }),
    //check('texto', 'El texto debe de ser más de 6 letras').isLength({ min: 6 }),
    validarArchivoSubir,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    check('titulo').custom( existeTrayectoriaPorNombre ),
    validarCampos
], nosotrosPost );

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    //validarArchivoSubir,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeTrayectoriaPorId ),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos
    ], nosotrosPut );

//--------------------ELIMINAR REGISTRO---------------------------//
router.delete('/:id',[
    //validarJWT,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeTrayectoriaPorId ),
    validarCampos
], NosotrosDelete );

router.patch('/', nosotrosPatch );





module.exports = router;