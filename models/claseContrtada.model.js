
const { Schema, model } = require('mongoose');

const ClaseContratadaSchema = Schema({
    claseId: {
        type: Schema.Types.ObjectId,
        required: [true, 'El id de la clase es obligatorio'],
        ref: 'Clase'
    },
    profesorId: {
        type: Schema.Types.ObjectId,
        required: [true, 'El id del profesor es obligatorio'],
        ref: 'User'
    },
    statusCompletada: {
        type: Boolean,
        default: false
    },
    statusAceptada: {
        type: Boolean,
        default: null
    },
    telefono: {
        type: Number,
        required: [true, 'El número de telefono es obligatorio']
    },
    mail: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    horario: {
        type: String,
        required: [true, 'El horario es obligatorio']
    },
    mensaje: {
        type: String,
        required: false
    },
    nombreAlumno: {
        type: String,
        required: [true, 'El nombre del alumno es obligatorio']
    }
})

ClaseContratadaSchema.methods.toJSON = function() {
    const { __v, ...clase } = this.toObject();
    return clase;
}

module.exports = model( 'ClaseContratada', ClaseContratadaSchema )
