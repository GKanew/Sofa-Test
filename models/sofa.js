const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SofaSchema = new Schema({
    nome: String,
    imagem: String,
    lugares: Number,
    comprimento: Number,
    largura: Number,
    profundidade: Number,
    laudo: {
        nomeinspetor: { type: String, default: ""},
        data: {type: Date, default: Date.now},
        estado: { type: String, enum: ['Pendente', 'Aprovado', 'Reprovado'], default: 'Pendente'}
    }
});

module.exports = mongoose.model('Sofa', SofaSchema);