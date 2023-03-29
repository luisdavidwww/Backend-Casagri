
const { Schema, model } = require('mongoose');
const { appconfig } = require('../../config');

const BannersSchema = Schema({
    nombre: {
        type: String,
        default: "",
    },
    descripcion: {
        type: String,
        default: "",
    },
    nombre_interno:{
        type: String,
    },
    banner__desktop: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    banner__movil: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
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

BannersSchema.methods.setImgUrl = function setImgUrl( filename ) {
    const { host, port  } = appconfig;
    this.img = `${host}:${port}/public/${filename}`
}


module.exports = model( 'Banners', BannersSchema );
