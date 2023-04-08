const { Schema, model } = require('mongoose');

const ArticuloSchema = Schema({
    counter: { 
        type: Number,
    },
    IdApi: { 
        type: String,
    },
    CodigoProd: { 
        type: String,
        required: [true, 'El codigo es obligatorio']
    },
    ean: { 
        type: String,
        default: "",
    },
    CodFabricante: { 
        type: String,
    },
    Nombre: {
        type: String,
    },
    IdCat1: {
        type: String,
    },
    cat1: {
        type: String,
    },
    IdCat2: {
        type: String,
    },
    cat2: {
        type: String,
    },
    IdCat3: {
        type: String,
    },
    Cat3: {
        type: String,
    },
    IdCat4: {
        type: String,
    },
    cat4: {
        type: String,
    },
    IdCat5: {
        type: String,
    },
    cat5: {
        type: String,
    },
    IDMarca: {
        type: String,
    },
    Marca: {
        type: String,
    },
    Imagen: {
        type: String,
        default: null
    },
    PesoKG: {
        type: Number,
    },
    ManejaStock: {
        type: String,
    },
    m2: {
        type: String,
    },
    Decimales: {
        type: String,
    },
    UndEnv: {
        type: String,
    },
    UndPedido: {
        type: String,
    },
    CompraMin: {
        type: String,
    },
    StockMin: {
        type: String,
    },
    Activo: {
        type: String,
    },
    ManejaLotes: {
        type: String,
    },


    LUpd_DateTime: {
        type: Date,
    },
    totalEntries: {
        type: Number,
    },
    totalPages: {
        type: Number,
    },
    errorMessage: {
        type: String,
        default: null
    },
});


ArticuloSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Articulo', ArticuloSchema );
