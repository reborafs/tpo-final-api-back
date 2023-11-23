
const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    comentarioInfo: {
        type: String
    },
    puntuacion: {
        type: Number
    },
    statusComentario: {
        type: Boolean,
        required: true,
        default: true
    }
})

ComentarioSchema.methods.toJSON = function() {
    const { __v, ...clase } = this.toObject();
    return clase;
}

module.exports = model( 'Comentario', ComentarioSchema )
