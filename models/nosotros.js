
const { Schema, model } = require('mongoose');

const NosotrosSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    texto: {
        type: String,
        required: [true, 'El correo es obligatorio'],
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



module.exports = model( 'Nosotros', NosotrosSchema );
