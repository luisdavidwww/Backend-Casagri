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

    const subcategoriaDB = await SubCategoria.findOne({ nombre });

    //validamos si existe una subcategoria con el mismo nombre
    if ( subcategoriaDB ) {
        return res.status(400).json({
            msg: `La subcategoria ${ subcategoriaDB.nombre }, ya existe`
        });
    }

    //validamos si existe un archivo cargado
    if (req.files)
    {
        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imagen_movil = secure_url;
    }
    if (req.files)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        imagen_principal = secure_url;
    }

    if (req.files)
    {
        // Generamos la data a guardar
        const subCategoria = {
            ...body, nombre, imagen_principal, imagen_movil,
        }

        //const producto = new Producto( data );
        const data = new SubCategoria(subCategoria);

        // Guardar DB
        await data.save();

        res.json({
            data
        });
    }
    else
    {
        // Generamos la data a guardar
        const subCategoria = {
            ...body, nombre
        }

        //const producto = new Producto( data );
        const data = new SubCategoria(subCategoria);

        // Guardar DB
        await data.save();

        res.json({
            data
        });
    }

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

        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.imagen_movil = secure_url; 
    }

    //variables alternas
    const imagen_principal = modelo.imagen_principal;
    const imagen_movil = modelo.imagen_movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const subCategoria = {
    ...resto, imagen_principal, imagen_movil
    }

    const data = await SubCategoria.findByIdAndUpdate(id, subCategoria);

    res.json({
        data
    });

}


//-------------------- ACTUALIZAR SUB-CATEGORIA NUEVO ---------------------------//
const actualizarCategoriaNuevo = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;

    //Buscamos la SubCategoria 
    modelo = await SubCategoria.findById(id);

    // Si hay archivo cargado para guardar Desktop
    if ( req.files.archivo ) {

        //No tiene un registro de Imagen Principal
        if ( modelo.imagen_principal == "" ){
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.imagen_principal = secure_url;
        }
        //Si tiene un registro de Imagen Principal
        else{
            const nombreArr = modelo.imagen_principal.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.imagen_principal = secure_url; 
        }
    }

    // Si hay archivo cargado para guardar Movil
    if ( req.files.archivoMovil ) {

         //No tiene un registro de Imagen Movil
         if ( modelo.imagen_movil == ""){
            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.imagen_movil = secure_url;
        }
        //Si tiene un registro de Imagen Movil
        else{
            const nombreArr = modelo.imagen_movil.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.imagen_movil = secure_url; 
        }
    }

    //variables alternas
    const imagen_principal = modelo.imagen_principal;
    const imagen_movil = modelo.imagen_movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const subCategoria = {
    ...resto, imagen_principal, imagen_movil
    }

    const data = await SubCategoria.findByIdAndUpdate(id, subCategoria);

    res.json({
        data
    });

}



//-------------------- OBTENER LISTADO DE SUB-CATEGORIAS ---------------------------//
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


//-------------------- FILTRAR SUB-CATEGORIAS POR CATEGORIA ---------------------------//
const filtrarSubCategorias = async(req, res = response ) => {

    //obtenemos el id por parámetro
    const { id } = req.params;
    const query = { categoria: id };

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


//-------------------- OBTENER 1 CATEGORIA POR ID ---------------------------//
const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const data = await Categoria.findById( id )
                                .populate('categoria', 'nombre')

    res.json({
        data
    });

}

//-------------------- OBTENER 1 CATEGORIA POR NOMBRE ---------------------------//
const obtenerCategoriaPorNombre = async(req, res = response ) => {

    const { nombre } = req.params;
    let data = await SubCategoria.findOne( {nombre} ).populate('categoria', ['nombre', 'imagen_principal' ])

    //si la subcategoria no tiene Banner Asignado
    if (data.imagen_principal == ""){
        const subcategoria = await SubCategoria.findOne( {nombre} )
        let nombreCategoria = subcategoria.categoria.nombre;
        let data = await Categoria.findOne( {nombreCategoria} );
        res.json({
            data
        });
    }
    else{
        res.json({
            data
        });
    }
    

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
    obtenerCategoriaPorNombre,
    filtrarSubCategorias,
    actualizarCategoria,
    actualizarCategoriaNuevo,
    borrarCategoria
}