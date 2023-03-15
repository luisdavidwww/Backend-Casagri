const { response } = require('express');
const { LineaProductos } = require('../models');



//--------------------CREAR REGISTRO---------------------------//
const crearLineasProductos = async(req, res = response ) => {

    const nombre = req.body.nombre;

    const LineaProductosDB = await LineaProductos.findOne({ nombre });

    if ( LineaProductosDB ) {
        return res.status(400).json({
            msg: `La categoria ${ LineaProductosDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const lineaProducto = {
        nombre
    }

    const data = new LineaProductos( lineaProducto );

    // Guardar DB
    await data.save();

    res.status(201).json(data);

    res.json({
        data
    });

}


//--------------------OBTENER LISTADO---------------------------//
const obtenerLineasProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        LineaProductos.countDocuments(query),
        LineaProductos.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        data
    });
}

const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id )
                            .populate('usuario', 'nombre');

    res.json( categoria );

}


const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria );

}

const borrarCategoria = async(req, res =response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( categoriaBorrada );
}




module.exports = {
    crearLineasProductos,
    obtenerLineasProductos,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}