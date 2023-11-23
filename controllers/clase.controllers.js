const { response, request } = require('express');

const Clase = require('../models/clase.model');
const User = require('../models/User.model');
const Comentario = require('../models/comentario.model');



const claseGet = async(req = request, res = response) => {

    const { id } = req.params;

    const clase = await Clase.findById(id)
    .populate({
        path: 'profesorId',
        select: 'name lastName'
    })
    .populate({
        path: 'commentId',
        select: 'comentarioInfo puntuacion statusComentario'
    });


    res.json({
        clase
    });
}

const listaClaseGet = async(req = request, res = response) => {

    const query = { statusClase: true }
    const { limit = 100, from = 0 } = req.query;


    const [total, clases] = await Promise.all([
        Clase.countDocuments(query),
        Clase.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'profesorId',
                    foreignField: '_id',
                    as: 'profesor'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    category: 1,
                    price: 1,
                    imgUrl: 1,
                    profesorName: {
                        $concat: [
                            { $arrayElemAt: ['$profesor.name', 0] },
                            ' ',
                            { $arrayElemAt: ['$profesor.lastName', 0] }
                        ]
                    }
                }
            },
            { $skip: Number(from) },
            { $limit: Number(limit) }
        ])
    ]);

    res.json({
        total,
        clases
    });
}

const claseCreate = async (req, res = response) => {

    const { title, profesorId, category, description, price, imgUrl, commentId } = req.body;
    const clase = new Clase({ title, profesorId, category, description, price, imgUrl, commentId });

    //Guardar en la BD
    await clase.save();

    res.status(201).json({
        msg: 'post API - Clase creada'
    });
}

const claseUpdate = async (req, res = response) => {

    const { id } = req.params;
    const { _id, profesorId, comments, ...resto } = req.body;

    const nuevosIdsDeComentarios = [];

    await Promise.all(comments.map(async comment => {
        if (comment.id) {
            await comentarioUpdate(comment);
        } else {
            const commentNewId = await comentarioCreate(comment);
            nuevosIdsDeComentarios.push(commentNewId);
        }
    }));

    await Clase.findByIdAndUpdate(id, { $push: { commentId: { $each: nuevosIdsDeComentarios } } });

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

const comentarioCreate = async (coment) => {

    const { comentarioInfo, puntuacion } = coment;
    const comentario = new Comentario({ comentarioInfo, puntuacion });
    
    const comentarioGuardado = await comentario.save();

    return comentarioGuardado._id;

};

const comentarioUpdate = async (coment) => {

    const { id, ...resto } = coment;

    await Comentario.findByIdAndUpdate( id, resto );

};

const misClaseGet = async (req, res = response) => {
    
    const { id } = req.params;


    const query = { profesorId: id }
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
};

module.exports = {
    claseGet,
    listaClaseGet,
    claseCreate,
    claseUpdate,
    claseDelete,
    misClaseGet
}