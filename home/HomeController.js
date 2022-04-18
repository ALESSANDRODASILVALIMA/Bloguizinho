const express = require('express');
const articlesModel  = require('../articles/ArticleModel');
const categoryModel = require('../categories/CategoryModel');
const adminLoguin = require('../midwares/adminLoguin');
const rotasHome = express.Router();

rotasHome.get('/',  (req, res) => {
    articlesModel.findAll({
        order: [
            ['id', 'asc']
        ],
        include: [
            {model: categoryModel}
        ], limit: 4
    }).then(function (dadosArtigos){       
        categoryModel.findAll().then(function (dadosCategoria){
            res.render('index', {
                dadosArtigos: dadosArtigos,  
                dadosCategoria: dadosCategoria         
            })
        })
    }).catch(function (err) {
        console.log(err);
    })    
})

rotasHome.get('/articles/:slug', function (req, res){
    var slug = req.params.slug;
    
    articlesModel.findOne(
        {where: {slug: slug}
    }).then(function (dadosArtigo){
        if(dadosArtigo != undefined){
            categoryModel.findAll().then(function (dadosCategoria){
                res.render('articles', {
                    dadosCategoria: dadosCategoria,
                    dadosArtigo: dadosArtigo
                });
            })
        }else{
            res.redirect("/")
        }
    }).catch(function (err) {
        console.log("Erro: "+err);
    })

})

rotasHome.get("/filtraCategoria/:Categoriaslug", function (req, res) {
        var Categoriaslug = req.params.Categoriaslug;
        categoryModel.findOne({
            where: {slug: Categoriaslug},
            include: [{model: articlesModel}]
        }).then(function (CategoriasFiltradas){
            categoryModel.findAll().then(function (dadosCategoria){                
              res.render('index', {
                  dadosArtigos: CategoriasFiltradas.Articles, dadosCategoria: dadosCategoria
                })
            })
            
        })
})


module.exports = rotasHome;