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
        img = secure_url;
        //data.setImgUrl(img);
    }

    if (req.files.archivoMovil)
    {
        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imgMini = secure_url;
        //data.setImgUrl(img);
    }

    const data = new Banners({ titulo, texto, nombre_interno, img, imgMini });
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
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;
    }

    if ( modelo.imgMini ) {
        const nombreArr = modelo.imgMini.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivoMini
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.imgMini = secure_url;
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
        data
    });
}



const mostrarImagen = async(req, res = response ) => {

    const coleccion = "banners";
    const { nombre_interno } = req.params;

    let modelo;
    modelo = await Banners.findOne({ nombre_interno })

    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );



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