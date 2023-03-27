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
        banner__movil = secure_url;
    }
    if (req.files)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        banner__desktop = secure_url;
    }

    if (req.files)
    {
        //asignamos el nombre interno
        const nombre_interno = req.body.nombre.replace(/\s+/g, '');

        // Generamos la data a guardar
        const subCategoria = {
            ...body, nombre,bombre_interno, banner__desktop, banner__movil,
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

        //asignamos el nombre interno
        const nombre_interno = req.body.nombre.replace(/\s+/g, '');
        
        // Generamos la data a guardar
        const subCategoria = {
            ...body, nombre, nombre_interno
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

        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__movil = secure_url; 
    }

    //variables alternas
    const banner__desktop = modelo.banner__desktop;
    const banner__movil = modelo.banner__movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const subCategoria = {
    ...resto, banner__desktop, banner__movil
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
    if ( req.files ) {

        //No tiene un registro de Banner Principal
        if ( modelo.banner__desktop == "" ){
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__desktop = secure_url;
        }
        //Si tiene un registro de Banner Principal
        else{
            const nombreArr = modelo.banner__desktop.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__desktop = secure_url; 
        }
    }

    // Si hay archivo cargado para guardar Movil
    if ( req.files ) {

         //No tiene un registro de Banner Movil
         if ( modelo.banner__movil == ""){
            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__movil = secure_url;
        }
        //Si tiene un registro de Banner Movil
        else{
            const nombreArr = modelo.banner__movil.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__movil = secure_url; 
        }
    }

    //variables alternas
    const banner__desktop = modelo.banner__desktop;
    const banner__movil = modelo.banner__movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const subCategoria = {
    ...resto, banner__desktop, banner__movil
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
    let data = await SubCategoria.findOne( {nombre} ).populate('categoria', ['nombre', 'banner__desktop' ])

    //si la subcategoria no tiene Banner Asignado
    if (data.banner__desktop == ""){
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