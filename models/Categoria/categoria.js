const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        //unique: true
    },
    descripcion: {
        type: String,
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

/*
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}*/


module.exports = model( 'Categoria', CategoriaSchema );
