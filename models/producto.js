const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    CodigoProd: { 
        type: String,
        required: [true, 'El codigo es obligatorio']
    },
    imagen_principal: {
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
        default: true,
        required: true
    },
});


ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Producto', ProductoSchema );
