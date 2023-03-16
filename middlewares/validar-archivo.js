const { response } = require("express")
const Banners = require('../models/Banners/banners');


const validarArchivoSubir = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();

}

const validarArchivoSubirTotal = async(req, res = response, next ) => {

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo || !req.files.archivoMovil ) {
            return res.status(400).json({
                msg: 'No hay archivos que subir - validarArchivoSubir '
            });
        }

        next();

    }



module.exports = {
    validarArchivoSubir,
    validarArchivoSubirTotal
}
