
const { Schema, model } = require('mongoose');

const BannersSchema = Schema({
    titulo: {
        type: String,
    },
    texto: {
        type: String,
    },
    nombre_interno:{
        type: String,
        required: [true, 'El nombre interno es obligatorio']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    estado: {
        type: Boolean,
        default: true
    },
});



module.exports = model( 'Banners', BannersSchema );
