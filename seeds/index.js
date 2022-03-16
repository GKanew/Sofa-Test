const mongoose = require('mongoose');
const Sofa = require('../models/sofa');
const Inspetor = require('../models/inspetor');
const Usuario = require('../models/usuario');

mongoose.connect('mongodb://localhost:27017/sofa-test', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
    await Sofa.deleteMany({});
    await Inspetor.deleteMany({});
    await Usuario.deleteMany({});
    for (let i = 0; i < 6; i++) {

        const usuario = new Usuario({
            nome: 'Maria '+ i,
            email: i + 'exemplo@exem.com',
            senha: 'senhaRuim',
            role: 'Usuario'
        })
        const usuarioI = new Usuario({
            nome: 'Junior ' + i,
            email: i + 'exemploInsp@exem.com',
            senha: 'senhaRuim2',
            role: 'Inspetor'
        })
        const inspetor = new Inspetor({
            _user: usuarioI
        })
        const sofa = new Sofa({
            nome: 'Sofa em L',
            lugares: i+2,
            comprimento: (i+1)*2
        })
        await sofa.save();
        await usuario.save();
        await usuarioI.save();
        await inspetor.save();
    }
}

seedDB().then(() => {
    console.log('db has been seeded.');
    mongoose.connection.close();
})

