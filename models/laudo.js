const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Mesma coisa que avaliação
const LaudoSchema = new Schema({
    sofaid: String,     //Sofa do laudo
    //inspetorid: String, //inspetor do laudo
    nomeinspetor: String,
    data: Date,
    estado: String
});

module.exports = mongoose.model('Laudo', LaudoSchema);