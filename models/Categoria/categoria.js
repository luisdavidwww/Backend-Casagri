const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        //unique: true
    },
    nombre_interno: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    imagen_principal: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    banner__desktop: {
        type: String,
        required: [true, 'La imagen del Banner es obligatoria'],
    },
    banner__movil: {
        type: String,
        required: [true, 'La imagen del Banner es obligatoria'],
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

/*
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}*/


module.exports = model( 'Categoria', CategoriaSchema );
