const { Schema, model } = require('mongoose');

const AcercaCasagriSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        //unique: true
    },
    texto: {
        type: String,
        required: [true, 'El texto es obligatorio'],
        //unique: true
    },
    creado: {
        type: Date, 
        default: Date.now()
    },
    actualizado: {
        type: Date,
        default: Date.now()
    },
    eliminado: {
        type: Date, 
    },
    estado: {
        type: Boolean,
        default: true,
    },
});



module.exports = model( 'AcercaCasagri', AcercaCasagriSchema );