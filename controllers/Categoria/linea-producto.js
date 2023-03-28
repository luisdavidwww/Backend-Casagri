const { response } = require('express');
const { LineaProductos, SubCategoria, Categoria } = require('../../models');

const path = require('path');
const fs   = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );




//-------------------- CREAR LINEA PRODUCTO ---------------------------//
const crearLineasProductos = async(req, res = response ) => {

    const { estado, ...body } = req.body;

    const nombre = req.body.nombre;

    const LineaProductoDB = await LineaProductos.findOne({ nombre });

    //validamos si existe una subcategoria con el mismo nombre
    if ( LineaProductoDB ) {
        return res.status(400).json({
            msg: `La subcategoria ${ LineaProductoDB.nombre }, ya existe`
        });
    }

    //validamos si existe un archivo cargado
    if (req.files)
    {
        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        banner__movil = secure_url;
    }
    if (req.files)
    {
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        banner__desktop = secure_url;
    }

    if (req.files)
    {
       //asignamos el nombre interno
       const nombre_interno = req.body.nombre.replace(/\s+/g, '');
        
        // Generamos la data a guardar
        const lineaProducto = {
            ...body, nombre, nombre_interno, banner__desktop, banner__movil,
        }

        //const producto = new Producto( data );
        const data = new LineaProductos(lineaProducto);

        // Guardar DB
        await data.save();

        res.json({
            data
        });
    }
    else
    {
        //asignamos el nombre interno
       const nombre_interno = req.body.nombre.replace(/\s+/g, '');

        // Generamos la data a guardar
        const lineaProducto = {
            ...body, nombre, nombre_interno
        }

        //const producto = new Producto( data );
        const data = new LineaProductos(lineaProducto);

        // Guardar DB
        await data.save();

        res.json({
            data
        });
    }

}


//-------------------- ACTUALIZAR SUB-CATEGORIA ---------------------------//
const actualizarLineaProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;

    //Buscamos la Linea de Producto 
    modelo = await LineaProductos.findById(id);


    // Limpiar imágenes previas
    if ( modelo.banner__desktop ) {
        const nombreArr = modelo.banner__desktop.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__desktop = secure_url;
    }
    if ( modelo.banner__movil ) {
        const nombreArr = modelo.banner__movil.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

        const { tempFilePath } = req.files.archivoMovil
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.banner__movil = secure_url; 
    }

    //variables alternas
    const banner__desktop = modelo.banner__desktop;
    const banner__movil = modelo.banner__movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const LineaProducto = {
    ...resto, banner__desktop, banner__movil
    }

    const data = await LineaProductos.findByIdAndUpdate(id, LineaProducto);

    res.json({
        data
    });

}


//-------------------- ACTUALIZAR SUB-CATEGORIA NUEVO ---------------------------//
const actualizarLineaProductoNuevo = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;

    //Buscamos la SubCategoria 
    modelo = await LineaProductos.findById(id);

    // Si hay archivo cargado para guardar Desktop
    if ( req.files.archivo ) {

        //No tiene un registro de Banner Principal
        if ( modelo.banner__desktop == "" ){
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__desktop = secure_url;
        }
        //Si tiene un registro de Banner Principal
        else{
            const nombreArr = modelo.banner__desktop.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__desktop = secure_url; 
        }
    }

    // Si hay archivo cargado para guardar Movil
    if ( req.files.archivoMovil ) {

         //No tiene un registro de Banner Movil
         if ( modelo.banner__movil == ""){
            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__movil = secure_url;
        }
        //Si tiene un registro de Banner Movil
        else{
            const nombreArr = modelo.banner__movil.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

            const { tempFilePath } = req.files.archivoMovil
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            modelo.banner__movil = secure_url; 
        }
    }

    //variables alternas
    const banner__desktop = modelo.banner__desktop;
    const banner__movil = modelo.banner__movil;

    //fecha de actualización
    modelo.actualizado = Date.now();
    await modelo.save();
    
   // Generamos la data a guardar
   const LineaProducto = {
    ...resto, banner__desktop, banner__movil
    }

    const data = await LineaProductos.findByIdAndUpdate(id, LineaProducto);

    res.json({
        data
    });

}



//-------------------- OBTENER LISTADO DE SUB-CATEGORIAS ---------------------------//
const obtenerLineasProductos = async(req, res = response ) => {


    const query = { estado: true };

    const [ total, data ] = await Promise.all([
        LineaProductos.countDocuments(query),
        LineaProductos.find(query)
        .populate('subcategoria', ['nombre', 'banner__desktop', 'banner__movil'])
    ]);

    res.json({
        total,
        data
    });
}


//-------------------- FILTRAR LINEA PRODUCTO POR  SUB-CATEGORIAS---------------------------//
const filtrarLineaProducto = async(req, res = response ) => {

    //obtenemos el id por parámetro
    const { id } = req.params;
    const query = { subcategoria: id };

    const [ total, data ] = await Promise.all([
        LineaProductos.countDocuments(query),
        LineaProductos.find(query)
        .populate('subcategoria', ['nombre', 'banner__desktop', 'banner__movil'])
    ]);

    res.json({
        total,
        data
    });
}


//-------------------- OBTENER 1 LINEA PRODUCTO POR ID ---------------------------//
const obtenerLineaProducto = async(req, res = response ) => {

    const { id } = req.params;
    const data = await LineaProductos.findById( id )
                                     .populate('subcategoria', ['nombre', 'banner__desktop', 'banner__movil'])

    res.json({
        data
    });

}


//-------------------- OBTENER 1 CATEGORIA POR NOMBRE ---------------------------//
const obtenerLineaProductoPorNombre = async(req, res = response ) => {

    //Se busca en Linea de Prod
    let { nombre_interno } = req.params;
    let data = await LineaProductos.findOne( {nombre_interno} )
                                    .populate('subcategoria', ['nombre', 'categoria'])
                                    

    //La consulta no es de Linea de Prod
    if (data == null){

        let subcategoria = await SubCategoria.findOne( {nombre_interno} ).populate('categoria', ['nombre'])

        //No existe el nombre_interno en la subCategoria 
        if (subcategoria == null){
            let data = await Categoria.findOne( {nombre_interno} )

            res.json({
                data
            });
        }

        //Existe el nombre_interno en la subCategoria 
        else{

            //La SubCategoria No tiene Banner Asignado
            if (subcategoria.banner__desktop == ""){

                let id = subcategoria.categoria._id;
                let data = await Categoria.findById( id );

                res.json({
                    subcategoria,
                    data
                });

            }
            //La SubCategoria tiene Banner Asignado
            else{
                let data = subcategoria;
                res.json({
                    data
                });
            }

        }
    }
    //La consulta es de Linea de Prod
    else{
        //La Linea de Prod No tiene Banner Asignado
        if (data.banner__desktop == ""){

            let id = data.subcategoria._id;
            let subcategoria = await SubCategoria.findById( id ).populate('categoria', ['nombre'])


            //La SubCategoria No tiene Banner Asignado
            if (subcategoria.banner__desktop == ""){

                let id = subcategoria.categoria._id;
                let data = await Categoria.findById( id );

                res.json({
                    subcategoria,
                    data
                });

            }
            //La SubCategoria tiene Banner Asignado
            else{
                let data = subcategoria;
                res.json({
                    data
                });
            }
        }
        //La Linea de Prod tiene Banner Asignado
        else{
            res.json({
                data
            });
        }
    }

    

/*
    if (data.banner__desktop == ""){

        const lineaProducto = await LineaProductos.findOne( {nombre_interno} )
        const id = lineaProducto.subcategoria._id;
        const subcateriaDB = await SubCategoria.findById( id )

         //La SubCategoria No tiene Banner Asignado
        if (subcateriaDB.banner__desktop == ""){

            let id = subcateriaDB.categoria._id;
            let data = await Categoria.findOne( id );
            res.json({
                data
            });
        }
        //La SubCategoria tiene Banner Asignado
        else{
            let data = subcateriaDB;
            res.json({
                data
            });
        }
        
    }
    else{
        res.json({
            data
        });
    }
    */

}

//-------------------- OBTENER 1 CATEGORIA POR NOMBRE ---------------------------//
const obtenerCategorias = async(req, res = response ) => {

    //Se busca en Linea de Prod
    let { nombre_interno } = req.params;
    let data = await LineaProductos.findOne( {nombre_interno} )
                                    .populate('subcategoria', ['nombre', 'categoria', ['nombre']])
                                    

    //La consulta no es de Linea de Prod
    if (data == null){

        let subcategoria = await SubCategoria.findOne( {nombre_interno} ).populate('categoria', ['nombre'])

        //La consulta no es de subCategoria 
        if (subcategoria == null){
            let data = await Categoria.findOne( {nombre_interno} )
            res.json({
                data
            });
        }

        //La consulta es de subCategoria 
        else{
            let data = subcategoria
            res.json({
                data,
            });
        }
    }
    //La consulta es de Linea de Prod
    else{

        res.json({
            data
        });  

    }


}

//-------------------- OBTENER 1 CATEGORIA POR NOMBRE ---------------------------//
const obtenerLineaPorNombre = async(req, res = response ) => {

    const { nombre } = req.params;
    let data = await LineaProductos.findOne( {nombre} ).populate('subcategoria', ['nombre', 'banner__desktop', 'banner__movil'])

        res.json({
            data
        });
}





module.exports = {
    crearLineasProductos,
    obtenerLineasProductos,
    obtenerLineaProductoPorNombre,
    obtenerCategorias,
    obtenerLineaPorNombre,
    obtenerLineaProducto,
    actualizarLineaProducto,
    actualizarLineaProductoNuevo
}