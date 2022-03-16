const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const { isLoggedIn } = require('./middleware');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('./models/usuario');



const usuarioRoutes = require('./routes/usuarios');
const sofaRoutes = require('./routes/sofas');
const inspetorRoutes = require('./routes/inspetores');


//====MONGOOSE CONNECT
mongoose.connect('mongodb://localhost:27017/sofa-test', {
    useNewUrlParser: true,
    //useCreateIndex: true,   //deprecated(?)
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app = express();

//Setting EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//Body parser
app.use(express.urlencoded({ extended: true }));

//Method Override pra put/delete
app.use(methodOverride('_method'));



//Config de sessão
const sessionConfig = {
    secret: 'thisisasecret!Donttellany0ne~',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //1 semana de cookie
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig)); //Tem que estar antes de passport


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Usuario.authenticate));
passport.use(Usuario.createStrategy()); //Resolveu

passport.serializeUser(Usuario.serializeUser()); //store user in session
passport.deserializeUser(Usuario.deserializeUser()); //unload user

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})


app.get('/', (req, res) => {
    res.redirect('/login');
})


app.get('/home', isLoggedIn, (req, res) => {
    res.render('home')
})


//======SOFA ROUTES=======
app.use('/sofas', sofaRoutes)


//======USUARIO ROUTES=======
app.use('/', usuarioRoutes);


//=======INSPETOR ROUTES========
app.use('/inspetores', inspetorRoutes);







//====TODO
/*
==Firstly
    Routes
    Pages
    CRUD
    Sofa
        Index   OK
        New     OK
        Show    OK
        Edit    OK
        Delete  OK
    
    Inspetor
        Index   OK
        New     OK
        Edit    OK
        Delete  OK
        Show    OK
    
    Usuario
        Index   temporary
        New     OK
        Edit    OK
        Delete  OK
        Show    OK
    
    Laudo em sofá   OK
    
 
==NEXT STUFF
    Auth            
        Emails não podem ser iguais
            Faz automaticamente         OK
        limitar acessos dependendo da role do usuario
            Usuario vs Inspetor         OK

    Checar se todas as telas existem

    Checar os casos de uso
        Criar usuário                   OK
        logar como usuário              OK
        Usuário cadastrar um inspetor   OK
        logar como inspetor             OK

        Usuário pode crud de todos inspetores               OK
        Usuario poder editar e deletar própria conta        OK~
            Mas não outros user
        
        Usuário pode Crud de todos sofas    OK

        Inspetor pode ver e avaliar sofas           Nope
        Inspetor pode ver ultima avaliação (sofa)   Nope
        Inspetor não pode editar conta (?)
        Inspetor não pode deletar conta (?)

    Parte Visual
        telas com bootstrap
        uso de url para imagem dos sofas




    Error handling (low priority for now)


==Later
    DB queries
        achar users por role        OK

    Relational data (DB)
        getting there   OK-ish


    Update associated objects (laudo and sofa for example)

    Ultima avaliação de um inspetor (aparece no home.)
        //alguém sem conta tem acesso a algo? acho q não

    Error handling
    Date Formatting
    Image Uploading


==Notes
    //Todo sofá só pode ter uma avaliação, e avaliação só tem 1 sofá.


    Usuário cria sofás e inspetores (CRUD em geral)
        Auth barra esses acessos
    Inspetores avaliam sofas e só (qualquer sofá)
        Auth barra esses acessos
        //Inspetor pode ver todos os sofás
    Faz login de Inspetor e Usuário (admin basicamente)
        //precisa de emails diferentes? yes

    Me parece que as telas representam view de um inspetor 
        apesar de aparecer escrito "cadastrar sofá"
        Depende/Varia
    

/*
//Old refs

//SOFA INDEX
app.get('/sofas', async (req, res) => {
    const sofas = await Sofa.find({});
    res.render('sofas/index', { sofas });
})


//INDEX USUARIO NÃO EXISTE
app.get('/usuarios', async (req, res) => {  //APENAS PARA DESENVOLVIMENTO
    const usuarios = await Usuario.find({role: 'Usuario'});
    res.render('usuarios/index', { usuarios });
})


//INSPETOR INDEX
app.get('/inspetores', async (req, res) => {
    const inspetores = await Inspetor.find({}).populate('_user');
    //const usuarios = await Usuario.find({role: 'Inspetor'});
    res.render('inspetores/index', { inspetores });
})

*/


app.use((req, res) => {
    
    res.status(404).send('NOT FOUND! - 404')
})

app.listen(3000, ()=>{
    console.log('Server running on 3000');
})
