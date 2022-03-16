const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UsuarioSchema = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type:String, enum:['Usuario','Inspetor']}
});

UsuarioSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('Usuario', UsuarioSchema);