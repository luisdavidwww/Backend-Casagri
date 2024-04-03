const { response } = require('express');
const { Documento } = require('../../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );



//-------------------- CREAR CATEGORIA ---------------------------//
const crearDocumento = async(req, res = response ) => {
    
    const { estado, ...body } = req.body;


    // Generamos la data a guardar
    const data = new Documento({ ...body });

    // Guardar DB
    await data.save();

    res.status(201).json({
        data
    });


}


//-------------------- ACTUALIZAR CATEGORIA ---------------------------//
const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;
    const nombre = req.body.nombre;

    //Buscamos la Categoria 
    modelo = await Documento.findById(id);


    // Limpiar imágenes previas
    if ( modelo.imagen_principal ) {
        const nombreArr = modelo.imagen_principal.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.imagen_principal = secure_url;
    }
    if (modelo.banner__desktop)
    {
        const { tempFilePath } = req.files.bannerDesktop
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__desktop = secure_url;
    }
    if (modelo.banner__movil)
    {
        const { tempFilePath } = req.files.bannerMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__movil = secure_url;
    }
    

    //fecha de actualización
    modelo.actualizado = Date.now();
    
    // Guardar DB
    await modelo.save();
    const data = await Documento.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        data
    });

}


//-------------------- OBTENER LISTADO DE CATEGORIAS ---------------------------//
const obtenerDocumentos = async(req, res = response ) => {

    //const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        Documento.countDocuments(query),
        Documento.find(query)
    ]);

    res.json({
        total,
        data
    });
}



//-------------------- ELIMINAR CATEGORIA ---------------------------//
const borrarCategoria = async(req, res =response ) => {

    const { id } = req.params;

    //Buscamos la Categoria 
    modelo = await Documento.findById(id);
    //fecha de eliminación
    modelo.eliminado = Date.now();
    // Guardar DB
    await modelo.save();


    const data = await Documento.findByIdAndUpdate( id, { estado: false });

    res.json( {data} );
}




module.exports = {
    crearDocumento,
    obtenerDocumentos,
    actualizarCategoria,
    borrarCategoria
}