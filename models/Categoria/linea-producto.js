const { Schema, model } = require('mongoose');

const LineaProductosSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    descripcion: {
        type: String,
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategoria',
        required: true
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


LineaProductosSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'LineaProductos', LineaProductosSchema );
