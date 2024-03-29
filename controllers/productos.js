const { response } = require('express');
const { Producto } = require('../models');


const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const axios = require('axios');
const fetch = require('node-fetch');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');




//-------------------------------------------------Metodos Api Casagri -----------------------------------//

//Maestro Productos Casagri
const maestroProductosCasagri = async (req, res) => {

    let data = JSON.stringify({
    "filters": [
        {}
    ]
    });

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD',
    headers: { 
        'Authorization': 'Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==', 
        'CpnyID': '0010', 
        'SiteID': 'LIVE', 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    //console.log(JSON.stringify(response.data));
        res.status(200).json(response.data);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        //res.status(500).json(error);
    });

};

//Diponibles Productos Casagri 
const stockProductosCasagri = async (req, res) => {

    let data = JSON.stringify({
    "filters": [
        {}
    ]
    });

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_STOCK',
    headers: { 
        'Authorization': 'Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==', 
        'CpnyID': '0010', 
        'SiteID': 'LIVE', 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    //console.log(JSON.stringify(response.data));
        res.status(200).json(response.data);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        //res.status(500).json(error);
    });

};

//Imagenes Productos Casagri
const ImagenProductosCasagri = async (req, res) => {

    let data = JSON.stringify({
    "filters": [
        {}
    ]
    });

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PICTURES',
    headers: { 
        'Authorization': 'Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==', 
        'CpnyID': '0010', 
        'SiteID': 'LIVE', 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    //console.log(JSON.stringify(response.data));
        res.status(200).json(response.data);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        //res.status(500).json(error);
    });

};





const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.skip( Number( desde ) )
            //.limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}


//Buscar 1 solo producto
const obtenerProducto = async(req, res = response ) => {

    let { CodigoProd } = req.params;
    const data = await Producto.findOne( {CodigoProd} )

    res.json( {data} );

}

//Obtener Producto por Nombre
const obtenerProductoPorNombre = async(req, res = response ) => {

    let { nombre_interno } = req.params;
    const data = await Producto.findOne( { nombre_interno } )

    res.json( {data} );

}


const obtenerProductoCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const query = { categoria: id };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ]);

    res.json({
        productos
    });

}

const crearProducto = async(req, res = response ) => { 

    const { ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    //cargamos el archivo
    if (req.files.archivo)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        body.imagen_principal = secure_url;
    }

    //asignamos el nombre interno
    const nombre_interno = req.body.nombre.replace(/\s+/g, '').replace(/%/g, "").replace(/[ / ]/g, "_");


    // Generar la data a guardar
    const data = {
        ...body, nombre_interno
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json({producto});

}


const crearMultiplesProducto = async (req, res = response) => {
    try {
        const { ...body } = req.body;
  
      // Verificar si los productos ya existen en la base de datos
      const productosExistentes = await Promise.all(
        body.map(async (producto) => {
          const productoDB = await Producto.findOne({ CodigoProd: producto.CodigoProd });
          if (productoDB) {
            return productoDB.CodigoProd;
          }
          return null;
        })
      );

      const productosDuplicados = productosExistentes.filter((CodigoProd) => CodigoProd !== null);
  
      if (productosDuplicados.length > 0) {
        return res.status(400).json({
          msg: `Los siguientes productos ya existen: ${productosDuplicados.join(", ")}`,
        });
      }
  
      // Procesar cada producto
      const productosGuardados = await Promise.all(
        body.map(async (producto) => {
            
          let imagen_principal = null;
  
          // Cargar el archivo de imagen si se proporciona
          if (req.files && req.files.archivo) {
            const { tempFilePath } = req.files.archivo;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            imagen_principal = secure_url;
          }
    
  
          // Generar la data a guardar
          const data = {
            ...producto,
            imagen_principal,
          };
  
          const nuevoProducto = new Producto(data);
          await nuevoProducto.save();
  
          return nuevoProducto;
        })
      );
  
      res.status(201).json({ productos: productosGuardados });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ msg: "Ocurrió un error al crear los productos" });
    }
  };





const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}








module.exports = {
    crearProducto,
    crearMultiplesProducto,
    obtenerProductos,
    obtenerProducto,
    obtenerProductoPorNombre,
    obtenerProductoCategoria,
    actualizarProducto,
    borrarProducto,
    //Metodos Proxy Productos 
    maestroProductosCasagri,
    stockProductosCasagri,
    ImagenProductosCasagri,
}