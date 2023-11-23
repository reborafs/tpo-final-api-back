const moongoose = require('mongoose');

const dbConnection = async() => {

    try{

        await moongoose.connect( process.env.DATABASE1 );

        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}


module.exports = {
    dbConnection
}