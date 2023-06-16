const { response } = require('express');
const Articulo = require('../models/articulo');
const axios = require('axios');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


//Listado de articulos Básico
const obtenerArticulos = async(req, res = response ) => {

   // const query = { Nombre };

    const [ total, productos ] = await Promise.all([
        Articulo.countDocuments(),
        Articulo.find()
    ]);

    res.json({
        total,
        productos
    });
}


const crearArticulo = async(req, res = response ) => {

    const { ...body } = req.body;

    const arti = await Articulo.findOne({ CodigoProd: body.CodigoProd });

    if ( arti ) {
        return res.status(400).json({
            msg: `El producto ${ arti.CodigoProd }, ya existe`
        });
    }


    // Generar la data a guardar
    const articuloDB = {
        ...body,
    }

    const data = new Articulo( articuloDB );

    // Guardar DB
    await data.save();

    res.status(201).json({data});

}


//Crear nuevo listado mediante archivo JSON
const crearArticuloListado = async (req, res = response) => {

    try {
      const archivo = req.files.archivo;
  
      fs.readFile(archivo.tempFilePath, 'utf8', async (err, contenido) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al leer el archivo' });
        }
  
        const registros = JSON.parse(contenido);
  
        await Articulo.insertMany(registros);
  
        res.status(200).json({ message: 'Archivos subidos exitosamente' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al subir los archivos' });
    }
};


//Eliminar todo y subir nuevos productos
const actualizarArticuloDrop = async (req, res = response) => {
    try {
      // solicitud a la API
      const respuesta = await disponiblesProductosCasagri();
  
      // Guardo mi JSON
      const registros = respuesta.data.myQueryResults.Table;
  
      // Elimino los registros anteriores
      await Articulo.deleteMany({});
  
      // guardo todos losproductos actualizados
      await Articulo.insertMany(registros);
  
      console.log('Registros insertados en la base de datos correctamente');
    } catch (error) {
      console.error('Error al obtener o insertar los datos:', error.message);
    }
};


//Actualizar articulo por ID
const actualizarArticuloID = async (req, res = response) => {
    try {

      //parametro del articulo
      let { articuloId } = req.params;

      const respuesta = await maestroProductosCasagri();
      const datosActualizados = respuesta.data.myQueryResults.Table;
  
      // Actualiza el campo deseado del artículo en la base de datos
      const articulo = await Articulo.findOneAndUpdate(
        { _id: articuloId },
        { $set: { StockActual: datosActualizados.StockActual } }, //actulizacion del stock
        { actualizado: Date.now() } 
      );
  
      if (articulo) {
        console.log('Artículo actualizado correctamente');
      } else {
        console.log('Artículo no encontrado en la base de datos');
      }
    } catch (error) {
      console.error('Error al actualizar el artículo:', error.message);
    }
};

//Actualizar todos los Articulos
const actualizarArticulo = async () => {
    try {
      const respuesta = maestroProductosCasagri();
      const datosActualizados = respuesta.data.myQueryResults.Table;

      for (const datoActualizado of datosActualizados) {
        // Busca el artículo en la base de datos por su _id
        const articulo = await Articulo.findOne({ _id: datoActualizado._id });
  
        if (articulo) {
          articulo.actualizado = datoActualizado.actualizado; 
          await articulo.save();
        }
      }
  
      console.log('Base de datos actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la base de datos:', error.message);
    }
  };




/*------------------- Metodos para la Api --------------------------*/

const maestroProductosCasagri = () => {
    let data = JSON.stringify({
      filters: [{}],
    });
  
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD',
      headers: {
        Authorization: 'Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==',
        CpnyID: '0010',
        SiteID: 'LIVE',
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    return axios.request(config);
};

const disponiblesProductosCasagri = () => {
    let data = JSON.stringify({
      filters: [{}],
    });
  
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_STOCK',
      headers: {
        Authorization: 'Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==',
        CpnyID: '0010',
        SiteID: 'LIVE',
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    return axios.request(config);
};



  
  
  
  
  
  
  



module.exports = {
    obtenerArticulos,
    crearArticuloListado,
    crearArticulo,
    actualizarArticuloDrop,
}