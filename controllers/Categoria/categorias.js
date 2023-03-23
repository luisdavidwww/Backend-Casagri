const { response } = require('express');
const { Categoria } = require('../../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );




//-------------------- CREAR CATEGORIA ---------------------------//
/*const crearCategoria = async(req, res = response ) => {
    
    const nombre = req.body.nombre

    const categoriaDB = await Categoria.findOne({ nombre });

    //validamos si existe una categoria con el mismo nombre
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //cargamos el archivo
    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imagen_principal = secure_url;
    }

    // Generamos la data a guardar
    const data = new Categoria({ nombre, imagen_principal });

    // Guardar DB
    await data.save();

    res.json({
        data
    });


}*/

//-------------------- CREAR CATEGORIA ---------------------------//
const crearCategoria = async(req, res = response ) => {
    
    const { estado, ...body } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: body.nombre  });


    //validamos si existe una categoria con el mismo nombre
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //cargamos el archivo
    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.imagen_principal = secure_url;
    }
    if (req.files.bannerDesktop)
    {
        const { tempFilePath } = req.files.bannerDesktop
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.banner__desktop = secure_url;
    }
    if (req.files.bannerMovil)
    {
        const { tempFilePath } = req.files.bannerMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.banner__movil = secure_url;
    }
    

    // Generamos la data a guardar
    const data = new Categoria({ ...body, });

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
    modelo = await Categoria.findById(id);

    //validamos que no exista una categoria con el mismo nombre
    /*const existeCategoria = await Categoria.findOne({nombre});
    if ( existeCategoria ) {
        return res.status(400).json({
            msg: `La categoria: ${ nombre }, ya existe`
        });
    }*/


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
        body.banner__desktop = secure_url;
    }
    if (modelo.banner__movil)
    {
        const { tempFilePath } = req.files.bannerMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.banner__movil = secure_url;
    }
    

    //fecha de actualización
    modelo.actualizado = Date.now();
    
    // Guardar DB
    await modelo.save();
    const data = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        data
    });

}


//-------------------- OBTENER LISTADO DE CATEGORIAS ---------------------------//
const obtenerCategorias = async(req, res = response ) => {

    //const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        total,
        data
    });
}


//-------------------- OBTENER 1 CATEGORIA ---------------------------//
const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const data = await Categoria.findById( id )

    res.json({
        data
    });

}



//-------------------- ELIMINAR CATEGORIA ---------------------------//
const borrarCategoria = async(req, res =response ) => {

    const { id } = req.params;

    //Buscamos la Categoria 
    modelo = await Categoria.findById(id);
    //fecha de eliminación
    modelo.eliminado = Date.now();
    // Guardar DB
    await modelo.save();


    const data = await Categoria.findByIdAndUpdate( id, { estado: false });

    res.json( {data} );
}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}