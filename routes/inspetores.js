const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const Inspetor = require('../models/inspetor');
const Usuario = require('../models/usuario');


//========INSPETOR ROUTES=========

//INSPETOR INDEX
router.get('/', isLoggedIn, async (req, res) => {
    if (req.user.role === 'Usuario'){ //somente Usuarios podem acessar index
        const inspetores = await Inspetor.find({}).populate('_user');
    
        //const usuarios = await Usuario.find({role: 'Inspetor'});
    
        return res.render('inspetores/index', { inspetores });
    }else{
        res.redirect('/sofas');
    }
})

//NEW INSPETOR          
router.get('/new', isLoggedIn, (req, res) => {
    if (req.user.role === 'Usuario') { //somente Usuarios podem acessar
        res.render('inspetores/new');
    }else{
        res.redirect('/sofas');
    }
})

//(POST) NEW INSPETOR
router.post('/', isLoggedIn, async (req, res) => {
    const { nome, email, senha } = req.body.inspetor;
    const usuario = new Usuario({
        nome,
        email,
        role: 'Inspetor'
    });
    await Usuario.register(usuario, senha);
    
    const inspetor = new Inspetor({
        _user: usuario
    })
    await inspetor.save();
    
    res.redirect(`/inspetores/${inspetor._id}`) //Show inspetor
})

//SHOW INSPETOR
router.get('/:id', isLoggedIn, async (req, res) => {
    if (req.user.role === 'Usuario') { //somente Usuarios podem acessar
        const inspetor = await Inspetor.findById(req.params.id).populate('_user');
        res.render('inspetores/show', { inspetor });
    }else{
        res.redirect('/sofas');
    }
})

//EDIT INSPETOR
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    if (req.user.role === 'Usuario') { //somente Usuarios podem acessar
        const inspetor = await Inspetor.findById(req.params.id).populate('_user');
        res.render('inspetores/edit', { inspetor })
    }else{
        res.redirect('/sofas');
    }
})

//(PUT) EDIT INSPETOR
router.put('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const inspetor = await Inspetor.findById(id);
    const usuario = await Usuario.findByIdAndUpdate(inspetor._user._id, { ...req.body.inspetor });
    res.redirect(`/inspetores/${inspetor._id}`)

})

//(DELETE) INSPETOR
router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const inspetor = await Inspetor.findById(id);
    await Usuario.findByIdAndDelete(inspetor._user._id);
    await Inspetor.findByIdAndDelete(id);
    res.redirect('/inspetores');
})

module.exports = router;