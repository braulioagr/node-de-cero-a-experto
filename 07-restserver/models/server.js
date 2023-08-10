import cors from 'cors'
import express from 'express';
import { UserRouter } from '../routes/usuarios.js';
import { AuthRouter } from '../routes/auth.js';
import { CategoriasRouter } from '../routes/categorias.js';
import { ProductosRouter } from '../routes/productos.js';
import { BuscarRouter } from '../routes/buscar.js';
import { UploadsRouter } from '../routes/uploads.js';
import { dbConnection } from '../database/config.js';
import pkg from 'express-fileupload';
export default class Server {
    

    constructor(){
        this.app = express();
        this.port =process.env.PORT;
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads'
        }
        // Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        
        //Cors
        this.app.use( cors() );
        
        // Lectura y Parseo del Body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //Carga de archivos
        this.app.use(pkg({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));

    }

    routes(){
        this.app.use( this.paths.auth , AuthRouter );
        this.app.use( this.paths.buscar, BuscarRouter );
        this.app.use( this.paths.categorias, CategoriasRouter );
        this.app.use( this.paths.productos, ProductosRouter );
        this.app.use( this.paths.usuarios , UserRouter );
        this.app.use( this.paths.uploads , UploadsRouter );
    }

    listen(){
        
        this.app.listen(this.port, ()=>{
            console.log(`Servidor corriendo en http://localhost:${ this.port }`);
        });
    }

}