const Clase = require('../models/clase.model');

const isClaseValid = async (req) => {

    const title = req.title;
    const profesorName = req.profesorName;

    const existTitle = await Clase.find({ profesorName, title, statusClase: true });

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

module.exports = {
    isClaseValid,
    existsClaseById,
    existsClaseByStatus
}