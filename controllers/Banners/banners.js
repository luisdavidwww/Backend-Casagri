const { response, request } = require('express');
const { Banners } = require('../../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );



//-------------------- CREAR BANNER ---------------------------//
const bannersPost = async(req, res = response) => {
    
    const coleccion = "banners";
    const { titulo, texto, nombre_interno } = req.body;

    //const img = await subirArchivo( req.files, undefined, coleccion );

    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        banner__desktop = secure_url;
    }

    if (req.files.archivoMovil)
    {
        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        banner__movil = secure_url;
    }

    const data = new Banners({ titulo, texto, nombre_interno, banner__desktop, banner__movil });
;

    // Guardar en BD
    await data.save();

    res.json({
        data
    });
}


//-------------------- ACTUALIZAR BANNER ---------------------------//
const bannersPut = async(req, res = response) => {

    const coleccion = "banners";
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    modelo = await Banners.findById(id);


    // Limpiar imágenes previas
    if ( modelo.banner__desktop ) {
        const nombreArr = modelo.banner__desktop.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__desktop = secure_url;
    }

    if ( modelo.banner__movil ) {
        const nombreArr = modelo.banner__movil.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivoMini
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__movil = secure_url;
    }

    await modelo.save();

    const data = await Banners.findByIdAndUpdate( id, resto );

    res.json({
        data
    });
    
}


//-------------------- OBTENER LISTADO DE BANNER ---------------------------//
const bannersGet = async(req = request, res = response) => {

    const { limite = 6, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        Banners.countDocuments(query),
        Banners.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        data
    });
}


//-------------------- OBTENER 1 BANNER POR NOMBRE ---------------------------//
const bannerGet = async(req = request, res = response) => {

    //const query = { nombre_interno: "Contacto" }
    const { nombre_interno } = req.params;

    const [ total, data ] = await Promise.all([
        Banners.countDocuments(nombre_interno),
        Banners.findOne({ nombre_interno }),
    ]);

    res.json({
        total,
        data
    });
}



const mostrarImagen = async(req, res = response ) => {

    const coleccion = "banners";
    const { nombre_interno } = req.params;

    let modelo;
    modelo = await Banners.findOne({ nombre_interno })

    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.banner__desktop );



    const [ total, data ] = await Promise.all([
        Banners.countDocuments(nombre_interno),
        Banners.findOne({ nombre_interno }),
    ]);

    res.json({
        data
    });
}



//--------------------ELIMINAR BANNER---------------------------//
const bannersDelete = async(req, res = response) => {

    const { id } = req.params;
    const data = await Banners.findByIdAndUpdate( id, { estado: false } );
    
    res.json({
        data
    });

}



const bannersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}


module.exports = {
    bannersGet,
    bannerGet,
    bannersPost,
    bannersPut,
    bannersDelete,
    bannersPatch,
    mostrarImagen,
}