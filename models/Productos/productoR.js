const { Schema, model } = require('mongoose');

const ProductoRSchema = Schema({
    counter: { 
        type: Number,
    },
    IdApi: { 
        type: String,
    },
    Nombre: {
        type: String,
    },
    StockActual: { 
        type: Number,
    },
    StockMinimo: { 
        type: Number,
    },
    cat1: {
        type: String,
    },
    cat2: {
        type: String,
    },
    Cat3: {
        type: String,
    },
    cat4: {
        type: String,
    },
    cat5: {
        type: String,
    },
    Marca: {
        type: String,
    },
    Imagen: {
        type: String,
        default: null
    },
});


ProductoRSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'ProductoR', ProductoRSchema );
