const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos,validarArchivoSubir, esAdminRole } = require('../../middlewares');

const { 
    crearProducto,
    crearProductoTotal,
    obtenerProductos,
    obtenerProductosPaginados,
    obtenerCat1,
    obtenerCat2,
    obtenerCat3,
    obtenerCat4,
    actualizarProductoPorID,
    crearProductoConArchivoJSON,
    actualizarTodosLosProducto,
    actualizarStockLosProducto,
    actualizarProductoDrop
        } = require('../../controllers/Productos/productoGeneral');


const { 
    otrosAgroquimicos,
    semillas,
    maizHibrido,
    cercasAlambreyElectricas,
    maquinarias,
    bambasDeAgua,
    analgesicosAntiinflamatorios,
    antisepticosDesinfectantes,
    antibioticos,
    antidiarreicos,
    bañosEctoparasitariosMatagusanos,
    biologicos,
    hemoparasiticidas,
    hormonales,
    vitaminasMinerales,
    implementosVeterinarios
        } = require('../../controllers/Productos/metodosfiltrado');

const {  existeProductoPorId } = require('../../helpers/db-validators');

const router = Router();


//------------------------------------- OBTENER PRODUCTOS -----------------------------------------//

router.get('/', obtenerProductos );
router.get('/obtenerProductosPaginados', obtenerProductosPaginados );
router.get('/Categoria/:categoria', obtenerCat1 );
router.get('/Categoria2/:categoria', obtenerCat2 );
router.get('/Categoria3/:categoria', obtenerCat3 );
router.get('/Categoria4/:categoria', obtenerCat4 );


//------------------------------------- FILTRAR PRODUCTOS -----------------------------------------//

router.get('/CategoriaBuscar/OtrosAgroquimicos', otrosAgroquimicos );
router.get('/CategoriaBuscar/Semillas', semillas );
router.get('/CategoriaBuscar/Maiz', maizHibrido );
router.get('/CategoriaBuscar/cercasAlambreyElectricas', cercasAlambreyElectricas );
router.get('/CategoriaBuscar/maquinarias', maquinarias );
router.get('/CategoriaBuscar/bambasDeAgua', bambasDeAgua );
router.get('/CategoriaBuscar/analgesicosAntiinflamatorios', analgesicosAntiinflamatorios );
router.get('/CategoriaBuscar/antisepticosDesinfectantes', antisepticosDesinfectantes );
router.get('/CategoriaBuscar/antibioticos', antibioticos );
router.get('/CategoriaBuscar/antidiarreicos', antidiarreicos );
router.get('/CategoriaBuscar/banosEctoparasitariosMatagusanos', bañosEctoparasitariosMatagusanos );
router.get('/CategoriaBuscar/biologicos', biologicos );
router.get('/CategoriaBuscar/hemoparasiticidas', hemoparasiticidas );
router.get('/CategoriaBuscar/hormonales', hormonales );
router.get('/CategoriaBuscar/vitaminasMinerales', vitaminasMinerales );
router.get('/CategoriaBuscar/implementosVeterinarios', implementosVeterinarios );


//------------------------------------- CREAR PRODUCTOS -----------------------------------------//

router.post('/', [ 
    //validarJWT,
    //validarArchivoSubir,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
], crearProducto );


router.post('/crearProductoTotal', [ 
], crearProductoTotal );

router.post('/subirLoteArticulo', [ 
], crearProductoConArchivoJSON );



//------------------------------------- ACTUALIZAR PRODUCTOS -----------------------------------------//

router.post('/ActualizarProductoPorID/:productoId', [ 
], actualizarProductoPorID );

router.post('/ActulizarTodosLosProductos', [ 
], actualizarTodosLosProducto );

router.post('/ActulizarStockLosProducto', [ 
], actualizarStockLosProducto );

router.post('/ActualizarProductosDrop', [ 
], actualizarProductoDrop );


module.exports = router;