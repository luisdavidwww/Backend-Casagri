const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server)

        this.paths = {
            auth:             '/api/auth',
            buscar:           '/api/buscar',
            categorias:       '/api/categorias',
            subcategorias:    '/api/subcategorias',
            lineaProducto:    '/api/lineaProductos',
            productos:        '/api/productos',
            usuarios:         '/api/usuarios',
            uploads:          '/api/uploads',
            acercaCasagri:    '/api/acercaCasagri',
            nosotros:         '/api/nosotros',
            trayectoria:      '/api/trayectoria',
            banners:          '/api/banners',
        }

        //this.app.use( '/public', express.static(`${__dirname}/storage/banners`));


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/Categoria/categorias'));
        this.app.use( this.paths.subcategorias, require('../routes/Categoria/sub-categoria'));
        this.app.use( this.paths.lineaProducto, require('../routes/Categoria/linea-producto'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        this.app.use( this.paths.acercaCasagri, require('../routes/Empresa/acerca-casagri'));
        this.app.use( this.paths.nosotros, require('../routes/Empresa/nosotros'));
        this.app.use( this.paths.trayectoria, require('../routes/Empresa/trayectoria'));
        this.app.use( this.paths.banners, require('../routes/Banners/banners'));
        
    }


    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
