const { Schema, model } = require('mongoose');

const LineaProductosSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    created_at: {
        type: Date, 
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: true
    },
});


LineaProductosSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'LineaProductos', LineaProductosSchema );
