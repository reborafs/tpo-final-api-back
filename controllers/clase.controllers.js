const { response, request } = require('express');
const cloudinary = require("cloudinary").v2;

const ClaseContratada = require('../models/claseContrtada.model');
const Clase = require('../models/clase.model');
const User = require('../models/user.model');
const Comentario = require('../models/comentario.model');



const claseGet = async (req = request, res = response) => {

    const { id } = req.params;

    const claseData = await Clase.findById(id)
        .populate({
            path: 'profesorId',
            select: 'name lastName exp bio titulo'
        })
        .populate({
            path: 'commentId',
            select: 'comentarioInfo calificacion statusComentario autor createDate'
        });

    const { _id, profesorId, statusClase, commentId, title, category, tipoClase, frecuencia, duracion, description, price, imgUrl } = claseData;

    const comments = commentId.map(comment => {
        return {
            statusComentario: comment.statusComentario,
            commentId: comment._id,
            comentarioInfo: comment.comentarioInfo,
            calificacion: comment.calificacion,
            autor: comment.autor,
            createDate: comment.createDate
        };
    });

    let cantCommentario = 0;
    let calificacionComentario = 0;
    comments.forEach(comentario => {
        if (comentario.statusComentario == true) {
            calificacionComentario = calificacionComentario + comentario.calificacion;
            cantCommentario++;
        }
    })

    const calificacion = {
        calificacion: calificacionComentario / cantCommentario
    };

    const profesor = {
        profesorId: profesorId._id,
        profesorName: `${profesorId.name} ${profesorId.lastName}`,
        profesorExp: profesorId.exp,
        profesorBio: profesorId.bio,
        profesorTitulo: profesorId.titulo
    }

    const claseId = { claseId: _id }

    const clase = { ...claseId, title, statusClase, category, tipoClase, frecuencia, duracion, description, price, imgUrl, ...profesor, comments, ...calificacion }

    console.log('clase --->',clase);

    res.json({
        clase
    });
}

const listaClaseGet = async (req = request, res = response) => {

    const query = { statusClase: true }
    const { limit = 100, from = 0 } = req.query;


    const [total, clasesData] = await Promise.all([
        Clase.countDocuments(query),
        Clase.find(query)
            .populate({
                path: 'profesorId',
                select: 'name lastName'
            })
            .populate({
                path: 'commentId',
                select: 'comentarioInfo calificacion statusComentario autor createDate'
            })
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    const clases = clasesData.map(clase => {

        let cantCommentario = 0;
        let calificacionComentario = 0;
        clase.commentId.forEach(comentario => {
            if (comentario.statusComentario == true) {
                calificacionComentario = calificacionComentario + comentario.calificacion;
                cantCommentario++;
            }
        });



        return {
            claseId: clase._id,
            title: clase.title,
            profesorName: `${clase.profesorId.name} ${clase.profesorId.lastName}`,
            category: clase.category,
            tipoClase: clase.tipoClase,
            frecuencia: clase.frecuencia,
            duracion: clase.duracion,
            calificacion: calificacionComentario / cantCommentario,
            price: clase.price,
            imgUrl: clase.imgUrl,


        }
    });

    res.json({
        total,
        clases
    });
}

const claseCreate = async (req, res = response) => {

    const { title, profesorId, category, tipoClase, frecuencia, duracion, description, price, imgUrl, commentId } = req.body;
    const clase = new Clase({ title, profesorId, category, tipoClase, frecuencia, duracion, description, price, imgUrl, commentId });

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

    await Clase.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'put API - Clase actualizada'
    });
}

const claseDelete = async (req, res = response) => {

    const { id } = req.params;

    await Clase.findByIdAndUpdate(id, { statusClase: false });

    res.status(200).json({
        msg: 'delete API - Clase borrada'
    });
}

const comentarioCreate = async (comment) => {

    const { comentarioInfo, calificacion, autor } = comment;
    const comentario = new Comentario({ comentarioInfo, calificacion, autor });

    const comentarioGuardado = await comentario.save();

    return comentarioGuardado._id;

};

const comentarioUpdate = async (comment) => {

    const { id, ...resto } = comment;

    await Comentario.findByIdAndUpdate(id, resto);

};

const comentarioUpdateParam = async (req, res = response) => {

    const { id } = req.params;
    const { statusComentario } = req.body;

    await Comentario.findByIdAndUpdate(id, { statusComentario: statusComentario });

    res.status(200).json({
        msg: 'actualizar API - Comentario actualizado'
    });

};

const comentarioCreatePostman = async (req, res = response) => {

    const { comentarioInfo, calificacion, autor } = req.body;
    const comentario = new Comentario({ comentarioInfo, calificacion, autor });

    await comentario.save();

    res.status(200).json({
        msg: 'crear API - Comentario creado'
    });

};

const misClaseGet = async (req, res = response) => {

    const { id } = req.params;
    const query = { profesorId: id, statusClase: true }
    const { limit = 100, from = 0 } = req.query;

    const [total, clasesData] = await Promise.all([
        Clase.countDocuments(query),
        Clase.find(query)
            .populate({
                path: 'profesorId',
                select: 'name lastName'
            })
            .populate({
                path: 'commentId',
                select: 'comentarioInfo calificacion statusComentario autor createDate'
            })
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    const clases = clasesData.map(clase => {

        let cantCommentario = 0;
        let calificacionComentario = 0;
        clase.commentId.forEach(comentario => {
            if (comentario.statusComentario == true) {
                calificacionComentario = calificacionComentario + comentario.calificacion;
                cantCommentario++;
            }
        });



        return {
            claseId: clase._id,
            title: clase.title,
            profesorName: `${clase.profesorId.name} ${clase.profesorId.lastName}`,
            category: clase.category,
            tipoClase: clase.tipoClase,
            frecuencia: clase.frecuencia,
            duracion: clase.duracion,
            calificacion: calificacionComentario / cantCommentario,
            price: clase.price,
            imgUrl: clase.imgUrl,


        }
    });

    res.json({
        total,
        clases
    });
};

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

const uploadImage = async function (req, res, next) {
    try {
        // Upload Image
        console.log("Uploading profile image...")
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        let data = res.json(cldRes);
        return data;
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({ status: 400, message: "Error while uploading." })
    }
}

const listaComentariosGet = async (req, res = response) => {

    const query = { calificacion: { $gte: 4.5 } }
    const { limit = 100, from = 0 } = req.query;


    const [total, comentariosData] = await Promise.all([
        Comentario.countDocuments(query),
        Comentario.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        comentariosData
    });
}


module.exports = {
    claseGet,
    listaClaseGet,
    claseCreate,
    claseUpdate,
    claseDelete,
    misClaseGet,
    comentarioUpdateParam,
    comentarioCreatePostman,
    uploadImage,
    listaComentariosGet
}