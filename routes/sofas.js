const express = require('express');
const router = express.Router();
const Sofa = require('../models/sofa');
const {isLoggedIn} = require('../middleware');

//======SOFA ROUTES=======

//SOFA INDEX
router.get('/', isLoggedIn, async (req, res) => {
    //view para inspetor é diferente de usuario. mas essa diferença pode ser direto no html
    const sofas = await Sofa.find({});
    res.render('sofas/index', { sofas });
})

//NEW SOFA          
router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('sofas/new');
})

//(POST) NEW SOFA
router.post('/', isLoggedIn, async (req, res) => {
    const sofa = new Sofa(req.body.sofa);
    await sofa.save();
    res.redirect(`/sofas/${sofa._id}`)
})

//SHOW SOFA
router.get('/:id', isLoggedIn, async (req, res) => {
    const sofa = await Sofa.findById(req.params.id);
    res.render('sofas/show', { sofa })
})

//EDIT SOFA
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const sofa = await Sofa.findById(req.params.id);
    res.render('sofas/edit', { sofa })
})

//(PUT) EDIT SOFA
router.put('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const sofa = await Sofa.findByIdAndUpdate(id, { ...req.body.sofa });
    res.redirect(`/sofas/${sofa._id}`)

})

//(DELETE) SOFA
router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Sofa.findByIdAndDelete(id);
    res.redirect('/sofas');
})

module.exports = router;