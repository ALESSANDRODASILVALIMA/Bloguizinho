const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const con = require('./database/database');
var session = require('express-session');

//importando rotas
const homeController = require('./home/HomeController');
const articlesController = require('./articles/ArticlesController');
const categoriesController = require('./categories/CategoriesController');
const userController = require('./user/UserController');


//importando os model
const ArticleModel = require('./articles/ArticleModel');
const CategoryModel = require('./categories/CategoryModel');





//ejs é a engine que vai renderiza html
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//pesquisar por redis bd para salvar session

//a session salva na memoria RAM por padrão use Redis para salvar se o projeto for de grande escla
app.use(session({
    //maxAge é o tempo que o cookie leva para expirar
secret: "abcdefg", cookie:{ maxAge: 30000 }
}))

//conectando com database
con.authenticate().then(function(){
    console.log("Conectado com sucesso!")
}).catch(function(err){
    console.log("Erro: " + err)
})

//Rotas para express_session Escrita
app.get('/sessionEscrita', function(req, res) {
    req.session.nomeCli = "Alessandro"
    req.session.email = "email@example.com"

    req.session.user = {
        id: 1,        
    }
    res.send("Gravado com sucesso!")

})

//Rotas para express_session Leitura
app.get('/sessionLeitura', function(req, res) {
    res.json({
       nome: req.session.nomeCli,
       email: req.session.email,
       id: req.session.user
    })
})

//usando rotas
app.use('/', homeController);
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);



app.listen(9091, () => {
    console.log("http://localhost:9091/");
})

