const { response } = require('express');
const Articulo = require('../models/articulo');
//const { Articulo } = require('../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const obtenerArticulos = async(req, res = response ) => {

    const query = { Activo: "SI" };

    const [ total, productos ] = await Promise.all([
        Articulo.countDocuments(query),
        Articulo.find(query)
    ]);

    res.json({
        total,
        productos
    });
}



const crearArticulo = async(req, res = response ) => {

    const { ...body } = req.body;

    const arti = await Articulo.findOne({ CodigoProd: body.CodigoProd });

    if ( arti ) {
        return res.status(400).json({
            msg: `El producto ${ arti.CodigoProd }, ya existe`
        });
    }


    // Generar la data a guardar
    const articuloDB = {
        ...body,
    }

    const data = new Articulo( articuloDB );

    // Guardar DB
    await data.save();

    res.status(201).json({data});

}





module.exports = {
    obtenerArticulos,
    crearArticulo
}