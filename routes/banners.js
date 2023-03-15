
const { Router } = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');


const {
    validarCampos,
    validarArchivoSubir,
    validarArchivoSubirTotal,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeBannersPorId, existeBannersPorNombre } = require('../helpers/db-validators');

const { bannersGet,
        bannerGet,
        bannersPost,
        bannersMulterPost,
        uploadImage,
        bannersPut,
        bannersDelete,
        bannersPatch,
        mostrarImagen,
            } = require('../controllers/banners');

const router = Router();






const storage = multer.diskStorage({
    destination: path.join(__dirname, '../storage/banners'),
    filename:  (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const uploadImageT = multer({
    storage,
    limits: {fileSize: 1000000}
}).single('image');





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

router.post('/images', (req, res) => {
    uploadImageT(req, res, (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        console.log(req.file);
        res.send('uploaded');
    });
});;

//--------------------ACTUALIZAR REGISTRO---------------------------//
router.put('/:id',[
    validarArchivoSubirTotal,
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