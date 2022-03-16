const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InspetorSchema = new Schema({
    numlaudos: {type: Number, default: 0},
    lastlaudoid: { type: Schema.Types.ObjectId, ref: 'Sofa', default: null },
    _user: {type: Schema.Types.ObjectId, ref: 'Usuario'} 
    //é como se Inspetor extendesse User.
});



module.exports = mongoose.model('Inspetor', InspetorSchema);