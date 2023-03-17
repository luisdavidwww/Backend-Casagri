const { response, request } = require('express');

const AcercaCasagri = require('../../models/Empresa/acerca-casagri');



//--------------------OBTENER REGISTRO---------------------------//
const acercaCasagriGet = async(req = request, res = response) => {

    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        AcercaCasagri.countDocuments(query),
        AcercaCasagri.findOne(query),
    ]);

    res.json({
        total,
        data
    });
}


//--------------------CREAR REGISTRO---------------------------//
const acercaCasagriPost = async(req, res = response) => {
    
    const { titulo, texto } = req.body;

    const data = new AcercaCasagri({ titulo, texto });

    // Guardar en BD
    await data.save();

    res.json({
        data
    });
}


//--------------------ACTUALIZAR REGISTRO---------------------------//
const acercaCasagriPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, ...resto } = req.body;

    modelo = await AcercaCasagri.findById(id);

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();

    const data = await AcercaCasagri.findByIdAndUpdate( id, resto );

    res.json({
        data
    });
    
}


//--------------------ELIMINAR REGISTRO---------------------------//
const acercaCasagriDelete = async(req, res = response) => {

    const { id } = req.params;
    const data = await AcercaCasagri.findByIdAndUpdate( id, { estado: false } );
    
    res.json({
        data
    });
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