const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const Banners = require('../models/banners');
const { subirArchivo } = require('../helpers');


//--------------------OBTENER LISTADO---------------------------//
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


//--------------------OBTENER 1 BANNER---------------------------//
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







//--------------------CREAR REGISTRO---------------------------//
const bannersPost = async(req, res = response) => {
    
    const coleccion = "banners";
    const { titulo, texto, nombre_interno } = req.body;

    const img = await subirArchivo( req.files, undefined, coleccion );

    const data = new Banners({ titulo, texto, nombre_interno, img });

    // Guardar en BD
    await data.save();

    res.json({
        data
    });
}

//--------------------ACTUALIZAR REGISTRO---------------------------//
const bannersPut = async(req, res = response) => {

    const coleccion = "banners";
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    modelo = await Banners.findById(id);

    // Limpiar imágenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const image = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = image;

    await modelo.save();

    const data = await Banners.findByIdAndUpdate( id, resto );
    res.json({
        data
    });
    
}

//--------------------ELIMINAR REGISTRO---------------------------//
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