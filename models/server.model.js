const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.claseRoutePath = '/api/clase';
        this.userRoutePath = '/api/users';

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
        this.app.use(this.userRoutePath, require('../routes/user.route'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }

}



module.exports = Server;