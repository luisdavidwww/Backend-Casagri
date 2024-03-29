const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const Trayectoria = require('../../models/Empresa/trayectoria');



//--------------------OBTENER LISTADO DE TRAYECTORIAS ---------------------------//
const nosotrosGet = async(req = request, res = response) => {

    const { limite = 6, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        Trayectoria.countDocuments(query),
        Trayectoria.find(query)
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
        imagen_principal = secure_url;
    }

    const data = new Trayectoria({ titulo, texto, imagen_principal });


    // Guardar en BD
    await data.save();

    res.json({
        data
    });
}

//-------------------- ACTUALIZAR REGISTRO ---------------------------//
const nosotrosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, ...body } = req.body;

    modelo = await Trayectoria.findById(id);

    if ( !req.files ) {
        //fecha de actualización
        modelo.actualizado = Date.now();
        await modelo.save();

        const data = await Trayectoria.findByIdAndUpdate( id, body );
        res.json({data});
        
    }
    else{
        //eliminamos la imagen anterior
        const nombreArr = modelo.imagen_principal.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
        //Cargamos lanueva imagen
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.imagen_principal = secure_url;

        //fecha de actualización
        modelo.actualizado = Date.now();
        await modelo.save();

        const data = await Trayectoria.findByIdAndUpdate( id, body );
        res.json({data});

    }

    
}

//--------------------ELIMINAR REGISTRO---------------------------//
const NosotrosDelete = async(req, res = response) => {

    const { id } = req.params;

    //Buscamos la Categoria 
    modelo = await Trayectoria.findById(id);

    //fecha de eliminación
    modelo.eliminado = Date.now();
    // Guardar DB
    await modelo.save();

    const data = await Trayectoria.findByIdAndUpdate( id, { estado: false } );
    
    res.json({data});

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