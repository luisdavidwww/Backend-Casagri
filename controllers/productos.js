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


 //res.json(data);
 //console.log("qui va"+data.json());
  const proxyControllera = async (req, res = response) => {
    try {

      const url = 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD'; 

      const authorization = 'REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==';
      const encodedAuthorization = `Basic ${authorization}`;
  
      const data  = await fetch(url,  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": "473", 
            "Host": "csgbqto.dyndns.org",
            "Accept": "*/*", 
            "Accept-Encoding": "gzip, deflate, br", 
            "Authorization": "Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==",
            "Connection": "keep-alive",
            "CpnyID": "0010", 
            "SiteID": "LIVE"
        }
      });
  
     
      if (data.ok) {
        const tabla = await data.json();
        console.log(tabla);
        res.status(200).json(tabla); // Envía la respuesta al cliente
      } else {
        throw new Error('Error en la solicitud' + data.statusText);
      }
      
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const proxyControllerA = async (req, res = response) => {
    const options = {
        hostname: 'csgbqto.dyndns.org',
        port: 6001,
        path: '/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD',
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": "268", 
            //"Host": "csgbqto.dyndns.org",
            "Accept": "*/*", 
            "Accept-Encoding": "gzip, deflate, br", 
            "Authorization": "Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==",
            "Connection": "keep-alive",
            "CpnyID": "0010", 
            "SiteID": "LIVE"
        },
      };
    
      const proxyRequest = http.request(options, (proxyResponse) => {
        let data = '';
    
        proxyResponse.on('data', (chunk) => {
          data += chunk;
        });
    
        proxyResponse.on('end', () => {
          res.status(proxyResponse.statusCode).json(data);
        });
      });
    
      proxyRequest.on('error', (error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    
      proxyRequest.end();
  };



  const proxyController = async (req, res) => {

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
        res.status(200).json(response.data)
        })
        .catch((error) => {
        console.log(error);
        });

};


  const proxyControllerF = async (req, res = response) => {

    const url = 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD';
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": "268", 
            "Host": "csgbqto.dyndns.org",
            "Accept": "*/*", 
            "Accept-Encoding": "gzip, deflate, br", 
            "Authorization": "Basic REVWRUxPUEVSOkJCRjk5OTM5NDhFMw==",
            "Connection": "keep-alive",
            "CpnyID": "0010", 
            "SiteID": "LIVE"
        },
        //timeout: 10000 
        
    };

    axios(url, options)
    .then(response => {
        // Manejar la respuesta exitosa aquí
        console.log(response.data);
        res.status(200).json(response.data)
    })
    .catch(error => {
        // Manejar el error aquí
        console.error(error);
        console.error("el error");
    })
};


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
    obtenerProductos,
    obtenerProducto,
    proxyController,
    obtenerProductoPorNombre,
    obtenerProductoCategoria,
    actualizarProducto,
    borrarProducto
}