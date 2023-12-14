const Clase = require('../models/clase.model');
const User = require('../models/user.model');
var jwt = require('jsonwebtoken');

const authorization = async (req, res, next) => {

    var token = req.headers['x-access-token'];
    console.log("token", token); 
    var msg = {auth: false, message: 'No token provided.'};
    if (!token)
        res.status(500).send(msg);

    let sec = process.env.SECRET;
    //console.log("secret",sec)
    jwt.verify(token, sec, async (err, decoded) => {
        var msg = {auth: false, message: 'Failed to authenticate token.'};
        if (err) res.status(500).send(msg);
        console.log("decoded", decoded); 
        await existsUserById(decoded.id);
        next();
    });
}

const isClaseValid = async (req) => {

    const title = req.title;
    const profesorId = req.profesorId;

    const existTitle = await Clase.find({ profesorId, title, statusClase: true });

    if ( existTitle.length != 0 ) {
        throw new Error('Ya tienes una clase con ese nombre');
    }

}

const existsClaseById = async (id = '') => {
    const existsClase = await Clase.findById( id );
    if ( !existsClase ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existsClaseByStatus = async (id = '') => {
    const existsClase = await Clase.findById( id );
    const statusClase = existsClase._doc.statusClase;
    if (  statusClase === false ) {
        throw new Error(`La clase no existe`);
    }
}

const existsUserById = async (id = '') => {
    const existsUser = await User.findById( id );
    if ( !existsUser ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

module.exports = {
    authorization,
    isClaseValid,
    existsClaseById,
    existsClaseByStatus,
    existsUserById
}