const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const passport = require('passport');
const Usuario = require('../models/usuario');


//========USUARIO ROUTES=========

//INDEX USUARIO NÃO EXISTE
/*
router.get('/usuarios', async (req, res) => {  //APENAS PARA DESENVOLVIMENTO

    const usuarios = await Usuario.find({ role: 'Usuario' });
    res.render('usuarios/index', { usuarios });
})
*/

//NEW USUARIO          
router.get('/registrar', (req, res) => {
    res.render('usuarios/register');
})

//(POST) NEW USUARIO
router.post('/registrar', async (req, res) => {
    const {nome,email,senha} = req.body.usuario;
    const usuario = new Usuario({
        nome,
        email,
        role: 'Usuario'
    });
    
    const novoUsuario = await Usuario.register(usuario, senha);
    
    //login automático após registrar
    req.login(novoUsuario, err =>{
        if(err) return next(err);
        res.redirect('/sofas')
    })
    
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', passport.authenticate('local', {/*failureFlash: true,*/ failureRedirect: '/login'}), (req,res)=>{
    //Aqui é login de Usuario e Inspetor tudo junto. Mas a autorização é em cada caso
    res.redirect('/sofas');
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/login');

})


//SHOW USUARIO
router.get('/usuarios/:id', isLoggedIn, async (req, res) => {
    if (req.user.role === 'Usuario' && req.user._id === req.params.id) { 
        
        const usuario = await Usuario.findById(req.params.id);
        res.render('usuarios/show', { usuario });
    } else {
        res.redirect('/sofas');
    }
})

//EDIT USUARIO
router.get('/usuarios/:id/edit', isLoggedIn, async (req, res) => {
    
    if (req.user.role === 'Usuario' && req.user._id === req.params.id) {
        const usuario = await Usuario.findById(req.params.id);
        res.render('usuarios/edit', { usuario })
        
    } else {
        res.redirect('/sofas');
    }
})

//(PUT) EDIT USUARIO
router.put('/usuarios/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { ...req.body.usuario });
    res.redirect(`/usuarios/${usuario._id}`)

})

//(DELETE) USUARIO
router.delete('/usuarios/:id', isLoggedIn, async (req, res) => {
    //NÃO DELETAR USUARIO DE INSPETOR POR AQUI          (!!)
    const { id } = req.params;
    await Usuario.findByIdAndDelete(id);
    res.redirect('/usuarios'); //DELETAR essa route DEPOIS         (!!)
})

module.exports = router;