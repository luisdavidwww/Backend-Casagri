const { Schema, model } = require('mongoose');

const LineaProductosSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    nombre_interno: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategoria',
        required: true
    },
    banner__desktop: {
        type: String,
        //required: [true, 'La imagen es obligatoria'],
        default: "",
    },
    banner__movil: {
        type: String,
        //required: [true, 'La imagen es obligatoria'],
        default: "",
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
