
const { Schema, model } = require('mongoose');

const TrayectoriaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    texto: {
        type: String,
        required: [true, 'El texto es obligatorio'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
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
        default: true
    },
});

module.exports = model( 'Trayectoria', TrayectoriaSchema );
