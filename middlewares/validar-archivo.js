const { response } = require("express")
const Banners = require('../models/banners');


const validarArchivoSubir = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();

}

const validarArchivoSubir2 = async(req, res = response, next ) => {

    const { id } = req.params;

    modelo = await Banners.findById(id);

    if ( modelo.img ) {
        next();
    }
    else{

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
            return res.status(400).json({
                msg: 'No hay archivos que subir - validarArchivoSubir'
            });
        }

        next();

    }
    
}


module.exports = {
    validarArchivoSubir,
    validarArchivoSubir2
}
