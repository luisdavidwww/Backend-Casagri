const { response, request } = require('express');
const multer = require('multer');
const bcryptjs = require('bcryptjs');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const Banners = require('../models/banners');
const { subirArchivo, sub } = require('../helpers');



const storage = multer.diskStorage({
    destination: path.join(__dirname, '/storage/banners'),
    filename:  (req, file, cb) => {
        cb(null, file.fieldname);
    }
})

const uploadImage = multer(storage).single('image');


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

    //const img = await subirArchivo( req.files, undefined, coleccion );

    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        img = secure_url;
        //data.setImgUrl(img);
    }

    if (req.files.archivoMini)
    {
        const { tempFilePath } = req.files.archivoMini
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


const bannersMulterPost = async(req, res = response) => {
    
    uploadImage(req, res, (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        console.log(req.file);
        res.send('uploaded');
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
    bannersMulterPost,
    uploadImage,
    bannersPut,
    bannersDelete,
    bannersPatch,
    mostrarImagen,
}