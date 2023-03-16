const { response } = require('express');
const { SubCategoria, Categoria } = require('../../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );



//-------------------- CREAR SUB-CATEGORIA ---------------------------//
const crearSubCategoria = async(req, res = response ) => {

    const { estado, ...body } = req.body;

    const nombre = req.body.nombre;
    const query = { estado: false };

    const subcategoriaDB = await SubCategoria.findOne({ nombre });
    const categoriaDB = await Categoria.findOne(query);

    //validamos si existe una subcategoria con el mismo nombre
    if ( subcategoriaDB ) {
        return res.status(400).json({
            msg: `La subcategoria ${ subcategoriaDB.nombre }, ya existe`
        });
    }

    //validamos si la categoria está disponible
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, no está disponible`
        });
    }

    //cargamos el archivo
    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imagen_principal = secure_url;
    }
    if (req.files.archivoMovil)
    {
        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imagen_movil = secure_url;
    }

    // Generamos la data a guardar
    const subCategoria = {
        ...body, nombre, imagen_principal, imagen_movil
    }

    //const producto = new Producto( data );
    const data = new SubCategoria(subCategoria);

    // Guardar DB
    await data.save();

    res.json({
        data
    });


}


//-------------------- ACTUALIZAR SUB-CATEGORIA ---------------------------//
const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;
    //const nombre = req.body.nombre;

    //Buscamos la SubCategoria 
    modelo = await SubCategoria.findById(id);


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
    if ( modelo.imagen_movil ) {
        const nombreArr = modelo.imagen_movil.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.imagen_movil = secure_url;
        
    }

    //variables alternas
    const imagen_principal = modelo.imagen_principal;
    const imagen_movil = modelo.imagen_movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    
   // Generamos la data a guardar
   const subCategoria = {
    ...resto, imagen_principal, imagen_movil
    }

    const data = await SubCategoria.findByIdAndUpdate(id, subCategoria);


    res.json({
        data
    });

}


//-------------------- OBTENER LISTADO DE CATEGORIAS ---------------------------//
const obtenerSubCategorias = async(req, res = response ) => {


    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        SubCategoria.countDocuments(query),
        SubCategoria.find(query)
        .populate('categoria', 'nombre')
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
    crearSubCategoria,
    obtenerSubCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}