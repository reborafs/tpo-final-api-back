const { response, request } = require('express');

const ClaseContratada = require('../models/claseContrtada.model');
const Clase = require('../models/clase.model');
const User = require('../models/user.model');
const Comentario = require('../models/comentario.model');


const claseContratadaCreate = async (req, res = response) => {

    const claseId = req.params.id;
    const { profesorId } = await Clase.findById(claseId);
    const { telefono, mail, horario, mensaje, nombreAlumno } = req.body;

    const claseContratada = new ClaseContratada({ claseId, profesorId, telefono, mail, horario, mensaje, nombreAlumno });

    //Guardar en la BD
    await claseContratada.save();

    res.status(201).json({
        msg: 'post API - Clase Contratada creada'
    });
}


const claseContratadaGet = async(req = request, res = response) => {

    const { id } = req.params;
    const claseContratada = await ClaseContratada.findById(id).populate("claseId");

    const { claseId } = claseContratada;
    const { profesorId } = claseId;

    const { name, lastName } = await User.findById(profesorId)

    const profesorName = `${name} ${lastName}`;

    res.json({
        claseContratada,
        profesorName
    });
}

const listaClaseContratadaGet = async (req, res = response) => {
    
    const { id } = req.params;
    const query = { profesorId: id }
    const { limit = 100, from = 0 } = req.query;

    const [total, clasecontratadas] = await Promise.all([
        ClaseContratada.countDocuments(query),
        ClaseContratada.find(query)
             .skip(Number(from))
             .limit(Number(limit))
             .populate("claseId")
    ])

    res.json({
        total,
        clasecontratadas
    });
};


module.exports = {
    claseContratadaCreate,
    claseContratadaGet,
    listaClaseContratadaGet
}