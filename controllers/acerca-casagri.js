const { response, request } = require('express');

const AcercaCasagri = require('../models/acerca-casagri');



//--------------------OBTENER LISTADO---------------------------//
const acercaCasagriGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, acercaCasagri ] = await Promise.all([
        AcercaCasagri.countDocuments(query),
        AcercaCasagri.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json(acercaCasagri);
}


//--------------------CREAR REGISTRO---------------------------//
const acercaCasagriPost = async(req, res = response) => {
    
    const { titulo, texto } = req.body;

    const acercaCasagri = new AcercaCasagri({ titulo, texto });

    // Guardar en BD
    await acercaCasagri.save();

    res.json({
        acercaCasagri
    });
}


//--------------------ACTUALIZAR REGISTRO---------------------------//
const acercaCasagriPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, ...data } = req.body;

    const acercaCasagri = await AcercaCasagri.findByIdAndUpdate( id, data );

    res.json(acercaCasagri);
    
}


//--------------------ELIMINAR REGISTRO---------------------------//
const acercaCasagriDelete = async(req, res = response) => {

    const { id } = req.params;
    const acercaCasagri = await AcercaCasagri.findByIdAndUpdate( id, { estado: false } );
    
    res.json(acercaCasagri);
}



const nosotrosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}





module.exports = {
    acercaCasagriGet,
    acercaCasagriPost,
    acercaCasagriPut,
    acercaCasagriDelete,
}