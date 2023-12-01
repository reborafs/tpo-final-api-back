
const { Schema, model } = require('mongoose');

const ClaseSchema = Schema({
    title: {
        type: String,
        required: [true, 'El nombre de la clase es obligatorio']
    },
    profesorId: {
        type: Schema.Types.ObjectId,
        required: [true, 'El id del profesor es obligatorio'],
        ref: 'User'
    },
    statusClase: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: String,
        required: [true, 'La categoria es obligatorio']
    },
    tipoClase: {
        type: String,
        required: [true, 'El tipo clase es obligatorio']
    },
    frecuencia: {
        type: String,
        required: [true, 'La frecuencia es obligatorio']
    },
    duracion: {
        type: String,
        required: [true, 'La duracion es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    imgUrl: {
        type: String,
        required: [true, "La url de la imagen es obligatorio"]
    },
    commentId: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }]
})

ClaseSchema.methods.toJSON = function() {
    const { __v, ...clase } = this.toObject();
    return clase;
}

module.exports = model( 'Clase', ClaseSchema )
