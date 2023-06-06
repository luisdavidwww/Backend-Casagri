const { response } = require('express');
const { Producto } = require('../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.skip( Number( desde ) )
            //.limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}


//Buscar 1 solo producto
const obtenerProducto = async(req, res = response ) => {

    let { CodigoProd } = req.params;
    const data = await Producto.findOne( {CodigoProd} )

    res.json( {data} );

}

//Obtener Producto por Nombre
const obtenerProductoPorNombre = async(req, res = response ) => {

    let { nombre_interno } = req.params;
    const data = await Producto.findOne( { nombre_interno } )

    res.json( {data} );

}

const obtenerProductoCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const query = { categoria: id };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ]);

    res.json({
        productos
    });

}

const crearProducto = async(req, res = response ) => {

    const { ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    //cargamos el archivo
    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.imagen_principal = secure_url;
    }

    //asignamos el nombre interno
    const nombre_interno = req.body.nombre.replace(/\s+/g, '').replace(/%/g, "").replace(/[ / ]/g, "_");


    // Generar la data a guardar
    const data = {
        ...body, nombre_interno
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json({producto});

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    obtenerProductoPorNombre,
    obtenerProductoCategoria,
    actualizarProducto,
    borrarProducto
}