const express = require('express');
const cors = require('cors');
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.claseRoutePath = '/api/clase';
        this.claseContratadaRoutePath = '/api/clase-contratada';
        this.userRoutePath = '/api/users';
        
        //Config image server
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
          });

        //Config multer middleware
        const storage = new Multer.memoryStorage();
        const upload = Multer({
            storage,
        });

        //Conectar a base de datos
        this.conectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectDB() {
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.claseRoutePath, require('../routes/clase.route'));
        this.app.use(this.claseContratadaRoutePath, require('../routes/claseContratada.route'));
        this.app.use(this.userRoutePath, require('../routes/user.route'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }

}



module.exports = Server;