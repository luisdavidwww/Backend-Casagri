const { response } = require('express');
const ProductoMSchema = require('../../models/Productos/productoM');
const ProductoRSchema = require('../../models/Productos/productoR');
const axios = require('axios');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );



//------------------------------------- CREAR PRODUCTOS -----------------------------------------/

//Crear 1 solo producto Producto 
const crearProducto = async(req, res = response ) => {

  const { ...body } = req.body;

  const arti = await ProductoMSchema.findOne({ CodigoProd: body.CodigoProd });

  if ( arti ) {
      return res.status(400).json({
          msg: `El producto ${ arti.CodigoProd }, ya existe`
      });
  }

  // Generar la data a guardar
  const articuloDB = {
    ...body,
}

const data = new ProductoMSchema( articuloDB );

// Guardar DB
await data.save();

res.status(201).json({data});

}

//Crear Todos los Productos desde cero
const crearProductoTotal = async(req, res = response ) => {
  try {
    
    const [maestroResp, disponibleResp, imageResp] = await Promise.all([
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD'),
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_STOCK'),
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PICTURES'),
    ]);

    const maestro = maestroResp.data.myQueryResults.Table;
    const disponible = disponibleResp.data.myQueryResults.Table;
    const image = imageResp.data.myQueryResults.Table;

    const productos = [];

    // Combinar los datos de las tres APIs
    for (const Disp of disponible) {
      const counter         = Disp.counter;
      const IdApi           = Disp.IdApi.trim();//usamos elmetodo trim para eliminar los espacios vacios
      const Nombre          = Disp.Nombre;
      const StockActual     = Disp.StockActual;
      const StockMinimo     = Disp.StockMinimo;

      const cat1            = maestro.find((p) => p.IdApi === IdApi)?.cat1 || '';
      const cat2            = maestro.find((p) => p.IdApi === IdApi)?.cat2 || '';
      const Cat3            = maestro.find((p) => p.IdApi === IdApi)?.Cat3 || '';
      const cat4            = maestro.find((p) => p.IdApi === IdApi)?.cat4 || '';
      const cat5            = maestro.find((p) => p.IdApi === IdApi)?.cat5 || '';

      const Marca           = maestro.find((p) => p.IdApi === IdApi)?.Marca || '';
      const Imagen          = image.find((p) => p.IdApi === IdApi)?.Imagen || '';

      const Nombre_interno  = Disp.Nombre.replace(/\s+/g, '-').replace(/%/g, "%25").replace(/[ / ]/g, "_");
      const Descripcion  = maestro.find((p) => p.IdApi === IdApi)?.Descripcion || '';


      productos.push({ 
        counter, 
        IdApi, 
        Nombre,
        Nombre_interno, 
        Descripcion,
        StockActual, 
        StockMinimo,
        cat1, 
        cat2, 
        Cat3, 
        cat4, 
        cat5, 
        Marca, 
        Imagen
      });
    }

    // Guardar los productos en la base de datos
    await ProductoMSchema.insertMany(productos);

    console.log('Productos guardados en la base de datos correctamente');
  } catch (error) {
    console.error('Error al obtener o guardar los productos:', error.message);
  }

}



//------------------------------------- OBTENER PRODUCTOS -----------------------------------------/

//Listado de Productos Básico
const obtenerProductos = async(req, res = response ) => {

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.countDocuments(),
      ProductoMSchema.find()
    ]);

    res.json({
        total,
        productos
    });
}

//Listado de Productos Paginado
const obtenerProductosPaginados = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.countDocuments(),
      ProductoMSchema.find()
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener los productos paginados:', error.message);
    res.status(500).json({ error: 'Error al obtener los productos paginados' });
  }
};

//Obtener todos los productos de la Categoria 1 Paginado
const obtenerCat1 =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    let { categoria } = req.params;

    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find({ cat1: categoria }).countDocuments(),
      ProductoMSchema.find({ cat1: categoria })
                      //.sort({ Nombre: 1 })
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
    };

    res.status(200).json(response);


};

//Obtener todos los productos de la Categoria 2 Paginado
const obtenerCat2 =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  let { categoria } = req.params;

  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find({ cat2: categoria }).countDocuments(),
    ProductoMSchema.find({ cat2: categoria })
                    .sort({ Nombre: 1 })
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
  };

  res.status(200).json(response);


};

const obtenerCat3 =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  let { categoria } = req.params;

  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find({ Cat3: categoria }).countDocuments(),
    ProductoMSchema.find({ Cat3: categoria })
                    //.sort({ Nombre: 1 })
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
  };

  res.status(200).json(response);


};

const obtenerCat4 =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  let { categoria } = req.params;

  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find({ cat4: categoria }).countDocuments(),
    ProductoMSchema.find({ cat4: categoria })
                    //.sort({ Nombre: 1 })
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
  };

  res.status(200).json(response);


};



//------------------------------------- ACTUALIZAR PRODUCTOS -----------------------------------------/


//Actualizar el campo StockActual buscando el producto por ID
const actualizarProductoPorID = async (req, res = response) => {
  try {
    // Parámetro del artículo
    const { productoId } = req.params;

    const respuesta = await disponiblesProductosCasagri();
    const datosActualizados = respuesta.data.myQueryResults.Table;

    // Buscar el artículo en los datos actualizados
    const productoActualizado = datosActualizados.find((dato) => dato.IdApi === productoId);

    if (productoActualizado) {
      // Actualizar el campo deseado del artículo en la base de datos
      const update = await ProductoMSchema.updateOne({ IdApi: productoId }, { StockActual: productoActualizado.StockActual });

      console.log(productoActualizado);
      console.log('Artículo actualizado correctamente');
      res.json( update );
    } else {
      console.log('Artículo no encontrado en los datos actualizados');
    }
  } catch (error) {
    console.error('Error al actualizar el artículo:', error.message);
  }
};

//Actualizar todos los campos de los Productos
const actualizarTodosLosProducto = async () => {
  try {

    // solicitud a la API
    const [maestroResp, disponibleResp, imageResp] = await Promise.all([
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD'),
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_STOCK'),
      fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PICTURES'),
    ]);

    const maestro = maestroResp.data.myQueryResults.Table;
    const disponible = disponibleResp.data.myQueryResults.Table;
    const image = imageResp.data.myQueryResults.Table;

    const productos = [];

    // Combinar los datos de las tres APIs
    for (const Disp of disponible) {
      const counter         = Disp.counter;
      const IdApi           = Disp.IdApi;
      const Nombre          = Disp.Nombre;
      const StockActual     = Disp.StockActual;
      const StockMinimo     = Disp.StockMinimo;

      const cat1            = maestro.find((p) => p.IdApi === IdApi)?.cat1 || '';
      const cat2            = maestro.find((p) => p.IdApi === IdApi)?.cat2 || '';
      const Cat3            = maestro.find((p) => p.IdApi === IdApi)?.Cat3 || '';
      const cat4            = maestro.find((p) => p.IdApi === IdApi)?.cat4 || '';
      const cat5            = maestro.find((p) => p.IdApi === IdApi)?.cat5 || '';

      const Marca           = maestro.find((p) => p.IdApi === IdApi)?.Marca || '';
      const Imagen          = image.find((p) => p.IdApi === IdApi)?.Imagen || '';


      productos.push({ 
        counter, 
        IdApi, 
        Nombre, 
        StockActual, 
        StockMinimo,
        cat1, 
        cat2, 
        Cat3, 
        cat4, 
        cat5, 
        Marca, 
        Imagen
      });
    }

    //variables para contar las peticiones
    const totalProductos = productos.length;
    let productosActualizados = 0;
    const mensajesProgreso = 100;

    for (const datoActualizado of productos) {
      // Busca el artículo en la base de datos por su _id
      const producto = await ProductoMSchema.findOne({ IdApi: datoActualizado.IdApi });
      //Metodo para guardar todo el obejeto
      if (producto) {
        // Reemplaza todos los campos del producto con los nuevos datos
        Object.assign(producto, datoActualizado);
        await producto.save();

        productosActualizados++;

        // Imprimir mensaje de progreso cada 100 productos
        if (productosActualizados % mensajesProgreso === 0) {
          console.log(`Productos actualizados: ${productosActualizados}/${totalProductos}`);
        }

      }
    }

    res.json( productos );
    console.log('Base de datos actualizada correctamente');

  } catch (error) {
    console.error('Error al actualizar la base de datos:', error.message);
  }
};

//Actualizar solo el campo StockActual de los Productos
const actualizarStockLosProducto = async () => {
  try {
    // solicitud a la API
    const respuesta = await disponiblesProductosCasagri();
    const datosActualizados = respuesta.data.myQueryResults.Table;

    const totalProductos = datosActualizados.length;
    let productosActualizados = 0;
    //const mensajesProgreso = 100;

    for (const datoActualizado of datosActualizados) {
      // Busca el artículo en la base de datos por su _id
      const producto = await ProductoMSchema.findOne({ IdApi: datoActualizado.IdApi });

      //Metodo para actualizar ciertos campos
      if (producto) {
        // Actualiza los campos específicos del producto con los nuevos datos
        producto.StockActual = datoActualizado.StockActual;
        await producto.save();

        productosActualizados++;
        console.log(`Producto ${productosActualizados}/${totalProductos} actualizado`);
      }

    }

    console.log('Base de datos actualizada correctamente');

  } catch (error) {
    console.error('Error al actualizar la base de datos:', error.message);
  }
};
    
//Eliminar todo y subir nuevos productos
const actualizarProductoDrop = async (req, res = response) => {
    try {
      // solicitud a la API
      const [maestroResp, disponibleResp, imageResp] = await Promise.all([
        fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PROD'),
        fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_STOCK'),
        fetchAPI('http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PICTURES'),
      ]);
  
      const maestro = maestroResp.data.myQueryResults.Table;
      const disponible = disponibleResp.data.myQueryResults.Table;
      const image = imageResp.data.myQueryResults.Table;
  
      const productos = [];
  
      // Combinar los datos de las tres APIs
      for (const Disp of disponible) {
        const counter         = Disp.counter;
        const IdApi           = Disp.IdApi;
        const Nombre          = Disp.Nombre;
        const StockActual     = Disp.StockActual;
        const StockMinimo     = Disp.StockMinimo;
  
        const cat1            = maestro.find((p) => p.IdApi === IdApi)?.cat1 || '';
        const cat2            = maestro.find((p) => p.IdApi === IdApi)?.cat2 || '';
        const Cat3            = maestro.find((p) => p.IdApi === IdApi)?.Cat3 || '';
        const cat4            = maestro.find((p) => p.IdApi === IdApi)?.cat4 || '';
        const cat5            = maestro.find((p) => p.IdApi === IdApi)?.cat5 || '';
  
        const Marca           = maestro.find((p) => p.IdApi === IdApi)?.Marca || '';
        const Imagen          = image.find((p) => p.IdApi === IdApi)?.Imagen || '';
  
        const Nombre_interno  = Disp.Nombre.replace(/\s+/g, '-').replace(/%/g, "%25").replace(/[ / ]/g, "_");
        const Descripcion  = maestro.find((p) => p.IdApi === IdApi)?.Descripcion || '';
  
  
        productos.push({ 
          counter, 
          IdApi, 
          Nombre,
          Nombre_interno, 
          Descripcion,
          StockActual, 
          StockMinimo,
          cat1, 
          cat2, 
          Cat3, 
          cat4, 
          cat5, 
          Marca, 
          Imagen
        });
      }
  
      // Elimino los registros anteriores
      await ProductoMSchema.deleteMany({});
  
      // guardo todos losproductos actualizados
      await ProductoMSchema.insertMany(productos);
  
      console.log('Registros insertados en la base de datos correctamente');
    } catch (error) {
      console.error('Error al obtener o insertar los datos:', error.message);
    }
};

//Crear nuevo listado de Productos mediante archivo JSON
const crearProductoConArchivoJSON = async (req, res = response) => {

  try {
    const archivo = req.files.archivo;

    fs.readFile(archivo.tempFilePath, 'utf8', async (err, contenido) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al leer el archivo' });
      }

      const registros = JSON.parse(contenido);

      await ProductoMSchema.insertMany(registros);

      res.status(200).json({ message: 'Archivos subidos exitosamente' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir los archivos' });
  }
};



//------------------------------------- ELIMINAR PRODUCTOS -----------------------------------------/

//Eliminar todos los Productos
const EliminarProductos = async (req, res = response) => {
  try {
    // solicitud a la API
    const respuesta = await disponiblesProductosCasagri();

    // Guardo mi JSON
    const registros = respuesta.data.myQueryResults.Table;

    // Elimino los registros anteriores
    await ProductoMSchema.deleteMany({});

    // guardo todos losproductos actualizados
    await ProductoMSchema.insertMany(registros);

    console.log('Registros insertados en la base de datos correctamente');
  } catch (error) {
    console.error('Error al obtener o insertar los datos:', error.message);
  }
};





/*------------------- Metodos para la Api --------------------------*/

//Productos Maestros
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

//Productos Disponibles
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

//Productos Imagenes 
const ImagenProductosCasagri = () => {

  let data = JSON.stringify({
    filters: [{}],
  });

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://csgbqto.dyndns.org:6001/ctDynamicsSL/api/quickQuery/VW_VENTTU_PICTURES',
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

  

const fetchAPI = async (url) => {

  let data = JSON.stringify({
    filters: [{}],
  });

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
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
  crearProducto,
  crearProductoTotal,
  obtenerProductos,
  obtenerProductosPaginados,
  obtenerCat1,
  obtenerCat2,
  obtenerCat3,
  obtenerCat4,
  crearProductoConArchivoJSON,
  actualizarProductoPorID,
  actualizarTodosLosProducto,
  actualizarStockLosProducto,
  actualizarProductoDrop,
  EliminarProductos,
}