const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const Nosotros = require('../../models/Empresa/nosotros');


//--------------------OBTENER LISTADO---------------------------//
const nosotrosGet = async(req = request, res = response) => {

    const { limite = 6, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        Nosotros.countDocuments(query),
        Nosotros.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        data
    });
}

//--------------------CREAR REGISTRO---------------------------//
const nosotrosPost = async(req, res = response) => {
    
    const { titulo, texto } = req.body;

    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        img = secure_url;
    }

    const nosotros = new Nosotros({ titulo, texto, img });


    // Guardar en BD
    await nosotros.save();

    res.json({
        nosotros
    });
}

//--------------------ACTUALIZAR REGISTRO---------------------------//
const nosotrosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, ...data } = req.body;

    modelo = await Nosotros.findById(id);

    //eliminamos la imagen anterior
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    await modelo.save();

    const nosotros = await Nosotros.findByIdAndUpdate( id, data );

    res.json(nosotros);
    
}

//--------------------ELIMINAR REGISTRO---------------------------//
const NosotrosDelete = async(req, res = response) => {

    const { id } = req.params;
    const nosotros = await Nosotros.findByIdAndUpdate( id, { estado: false } );
    
    res.json(nosotros);

}



const nosotrosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}



module.exports = {
    nosotrosGet,
    nosotrosPost,
    nosotrosPut,
    NosotrosDelete,
    nosotrosPatch,
}