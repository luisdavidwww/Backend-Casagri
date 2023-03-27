const { Schema, model } = require('mongoose');

const SubCategoriaSchema = Schema({
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
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
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


SubCategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'SubCategoria', SubCategoriaSchema );
