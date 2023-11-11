
const { Schema, model } = require('mongoose');

const ClaseSchema = Schema({
    title: {
        type: String,
        required: [true, 'El nombre de la clase es obligatorio']
    },
    profesorName: {
        type: String,
        required: [true, 'El nombre del profesor es obligatorio']
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
    commentId: {
        type: Object,
        default: []
    }
})

ClaseSchema.methods.toJSON = function() {
    const { __v, ...clase } = this.toObject();
    return clase;
}

module.exports = model( 'Clase', ClaseSchema )
