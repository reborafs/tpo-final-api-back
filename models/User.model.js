var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var UserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    titulo: String,
    exp: Number,
    date: Date,
    imgUrl: String,
    telefono: Number,
    bio: String,
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User;