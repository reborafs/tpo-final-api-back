const { response, request } = require('express');

const ClaseContratada = require('../models/claseContrtada.model');
const Clase = require('../models/clase.model');
const User = require('../models/user.model');
const Comentario = require('../models/comentario.model');
const sendMail = require('../helpers/mailer');



const claseContratadaCreate = async (req, res = response) => {

    const claseId = req.params.id;
    const { profesorId } = await Clase.findById(claseId);
    const { telefono, mail, horario, mensaje, nombreAlumno } = req.body;

    const claseContratada = new ClaseContratada({ claseId, profesorId, telefono, mail, horario, mensaje, nombreAlumno });
    try {
        //Guardar en la BD
        let mongoResponse = await claseContratada.save();
        console.log("Sending confirmation: ", mail);
        let email = {
            to: mail,
            subject: "Clase contratada",
            text: `Gracias por utilizar nuestros servicios. Dirigete hacia este link para visualizar tu clase: ${process.env.FRONTEND_URL}/ver-clase-contratada/${claseContratada._id}`, // plain text body
            //html: "<b>Thank you!</b>",
        }
        let response = await sendMail(email);
        return res.status(201).json({msg: 'post API - Clase Contratada creada'});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}


const claseContratadaGet = async (req = request, res = response) => {

    const { id } = req.params;
    const claseData = await ClaseContratada.findById(id)
            .populate({
                path: 'claseId',
                select: '_id title imgUrl'
            });

    

    const { claseId } = claseData;

    const claseContratada = {
        claseContratadaId: id,
        claseId: claseId._id,
        title: claseId.title,
        statusCompletada: claseData.statusCompletada,
        statusAceptada: claseData.statusAceptada,
        telefono: claseData.telefono,
        mail: claseData.mail,
        horario: claseData.horario,
        mensaje: claseData.mensaje,
        imgUrl: claseId.imgUrl,
        nombreAlumno: claseData.nombreAlumno,
    }



    res.json({
        claseContratada
    });
}


const getListaClaseContratada = async (req, res = response) => {

    const { id } = req.params;
    const query = { profesorId: id }
    const { limit = 100, from = 0 } = req.query;

    const [total, clasesData] = await Promise.all([
        ClaseContratada.countDocuments(query),
        ClaseContratada.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate({
                path: 'claseId',
                select: '_id title profesorId category tipoClase frecuencia duracion price imgUrl'
            })
    ])

    const { name, lastName} = await User.findById(id);

    //console.log('clasesData',clasesData);

    const claseContratadas = clasesData.map(clase => {

        return {
            claseContratadaId: clase._id,
            title: clase.claseId.title,
            profesorName: `${name} ${lastName}`,
            category: clase.claseId.category,
            tipoClase: clase.claseId.tipoClase,
            frecuencia: clase.claseId.frecuencia,
            duracion: clase.claseId.duracion,
            price: clase.claseId.price,
            imgUrl: clase.claseId.imgUrl,
            statusCompletada: clase.statusCompletada,
            statusAceptada: clase.statusAceptada,
            nombreAlumno: clase.nombreAlumno,
            telefono: clase.telefono,
            mail: clase.mail,
            horario: clase.horario,
            mensaje: clase.mensaje,
          }});

          //console.log('clasesData',clasesData);

    res.json({
        total,
        claseContratadas
    });
};


const statusClaseContratadaUpdate = async (req, res = response) => {

    const { id } = req.params;
    const { statusClaseContratada } = req.body;

    let response = await ClaseContratada.findByIdAndUpdate( id,  {statusAceptada: statusClaseContratada} );
    console.log(response)
    // TODO manejo de error si no guarda el mongo
    return res.status(200).json({status: 200, ok: true, message: "STATUS NUEVO DE CLASE "});

};

module.exports = {
    claseContratadaCreate,
    claseContratadaGet,
    getListaClaseContratada,
    statusClaseContratadaUpdate
}