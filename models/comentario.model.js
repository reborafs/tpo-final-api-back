
const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    comentarioInfo: {
        type: String
    },
    calificacion: {
        type: Number
    },
    statusComentario: {
        type: Boolean,
        required: true,
        default: true
    },
    autor: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

ComentarioSchema.methods.toJSON = function() {
    const { __v, ...clase } = this.toObject();
    return clase;
}

module.exports = model( 'Comentario', ComentarioSchema )
