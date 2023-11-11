const { response, request } = require('express');

const Clase = require('../models/clase.model');

const claseGet = async(req = request, res = response) => {

    const { id } = req.params;
    const clase = await Clase.findById( id );

    res.json({
        clase
    });
}

const listaClaseGet = async(req = request, res = response) => {

    const query = { statusClase: true }
    const { limit = 100, from = 0 } = req.query;


    const [total, clases] = await Promise.all([
        Clase.countDocuments(query),
        Clase.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        clases
    });
}

const claseCreate = async (req, res = response) => {

    const { title, profesorName, category, description, price, imgUrl, commentId } = req.body;
    const clase = new Clase({ title, profesorName, category, description, price, imgUrl, commentId });

    //Guardar en la BD
    await clase.save();

    res.status(201).json({
        msg: 'post API - Clase creada'
    });
}

const claseUpdate = async (req, res = response) => {

    const { id } = req.params;
    const { _id, commentId, ...resto } = req.body;

    await Clase.findByIdAndUpdate( id, resto );

    res.status(200).json({
        msg: 'put API - Clase actualizada'
    });
}

const claseDelete = async (req, res = response) => {

    const { id } = req.params;

    await Clase.findByIdAndUpdate( id, {statusClase: false} );

    res.status(200).json({
        msg: 'delete API - Clase borrada'
    });
}

module.exports = {
    claseGet,
    listaClaseGet,
    claseCreate,
    claseUpdate,
    claseDelete
}