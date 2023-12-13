const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json'); // Replace with the actual path


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.claseRoutePath = '/api/clase';
        this.claseContratadaRoutePath = '/api/clase-contratada';
        this.userRoutePath = '/api/users';
        this.swaggerRoutePath = '/api-docs';

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

        //Parser
        this.app.use(bodyParser.json());

    }

    routes() {
        this.app.use(this.claseRoutePath, require('../routes/clase.route'));
        this.app.use(this.claseContratadaRoutePath, require('../routes/claseContratada.route'));
        this.app.use(this.userRoutePath, require('../routes/user.route'));
        this.app.use(this.swaggerRoutePath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }

}



module.exports = Server;