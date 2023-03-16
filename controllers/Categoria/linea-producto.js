const { response } = require('express');
const { LineaProductos } = require('../../models');



//-------------------- CREAR LINEA DE PRODUCTO ---------------------------//
const crearLineasProductos = async(req, res = response ) => {

    const { estado, ...body } = req.body;

    const nombre = req.body.nombre;

    const lineaProductoDB = await LineaProductos.findOne({ nombre });

    //validamos si existe una LineaProducto con el mismo nombre
    if ( lineaProductoDB ) {
        return res.status(400).json({
            msg: `La subcategoria ${ lineaProductoDB.nombre }, ya existe`
        });
    }

    // Generamos la data a guardar
    const lineaProducto = {
        ...body,
    }

    //const producto = new Producto( data );
    const data = new LineaProductos(lineaProducto);

    // Guardar DB
    await data.save();

    res.json({
        data
    });


}


//-------------------- OBTENER LISTADO LINEA DE PRODUCTO ---------------------------//
const obtenerLineasProductos = async(req, res = response ) => {

    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        LineaProductos.countDocuments(query),
        LineaProductos.find(query)
        .populate('subcategoria', 'nombre')
    ]);

    res.json({
        total,
        data
    });
}

//-------------------- OBTENER 1 LINEA DE PRODUCTO ---------------------------//
const obtenerLineaProducto = async(req, res = response ) => {

    const { id } = req.params;
    const data = await LineaProductos.findById( id )
                                     .populate('subcategoria', 'nombre')

    res.json({ data });

}

//-------------------- ACTUALIZAR LINEA DE PRODUCTO ---------------------------//
const actualizarLineaProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;

    //Buscamos la LineaProducto 
    modelo = await LineaProductos.findById(id);

    //fecha de actualización
    modelo.actualizado = Date.now();

    
   // Generamos la data a guardar
   const lineaProducto = {
    ...resto
    }

    const data = await LineaProductos.findByIdAndUpdate(id, lineaProducto);

    res.json({
        data
    });

}

//-------------------- ELIMINAR LINEA DE PRODUCTO ---------------------------//
const borrarLineaProducto = async(req, res =response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( categoriaBorrada );
}




module.exports = {
    crearLineasProductos,
    obtenerLineasProductos,
    obtenerLineaProducto,
    actualizarLineaProducto,
    borrarLineaProducto
}