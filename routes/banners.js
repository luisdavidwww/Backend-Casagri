
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarArchivoSubir,
    validarArchivoSubir2,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeBannersPorId, existeBannersPorNombre } = require('../helpers/db-validators');

const { bannersGet,
        bannerGet,
        bannersPost,
        bannersPut,
        bannersDelete,
        bannersPatch,
        mostrarImagen,
            } = require('../controllers/banners');

const router = Router();



//--------------------OBTENER LISTADO---------------------------//
router.get('/', bannersGet );


//--------------------OBTENER 1 BANNERS---------------------------//
router.get('/:nombre_interno',[
    check('nombre_interno').custom( existeBannersPorNombre ),
    validarCampos,
], mostrarImagen );

//--------------------CREAR REGISTRO---------------------------//
router.post('/',[
    validarArchivoSubir,
    check('nombre_interno', 'El nombre interno es obligatorio').not().isEmpty(),
    validarCampos
], bannersPost );

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    validarArchivoSubir,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeBannersPorId ),
    check('nombre_interno', 'El nombre interno es obligatorio').not().isEmpty(),
    validarCampos
    ], bannersPut );

//--------------------ELIMINAR REGISTRO---------------------------//
router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeBannersPorId ),
    validarCampos
], bannersDelete );


router.patch('/', bannersPatch );

module.exports = router;