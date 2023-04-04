const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    counter: {
        type: Number,
    },
    IdApi: {
        type: String,
    },
    CodigoProd: {
        type: String,
    },
    ean: {
        type: String,
    },
    CodFabricante: {
        type: String,
    },
    Nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
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
    IdCat4: {
        type: String,
    },
    Imagen: {
        type: String,
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
        type: String,
    },
    totalPages: {
        type: Number,
    },
    errorMessage: {
        type: String,
    },
});


ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Producto', ProductoSchema );
