const express = require('express');
const rotaArticles = express.Router();
const categoryModel = require('../categories/CategoryModel');
const articlesModel = require('./ArticleModel');
const slugify = require('slugify');
const adminLoguin = require('../midwares/adminLoguin');

rotaArticles.get('/admin/artigos/new', (req, res) => {
    
    categoryModel.findAll().then((dadosCategoria) => {
        res.render('admin/artigos/new', {dadosCategoria: dadosCategoria});        
    })

})
rotaArticles.post('/artigos/delete', adminLoguin, (req, res) => {
    var id = req.body.id;
    if (isNaN(id)) {
        articlesModel.destroy({
            where: {
                id: id
            }
        }).then((dadosCategoria) => {
            res.redirect('/admin/artigos/listar')
        })
    }else{
        res.render("Não é um id Valido")
    }
})



rotaArticles.post('/artigos/salvar', adminLoguin,(req, res) => {
    var category = req.body.category;
    var titulo = req.body.titulo;
    var texto = req.body.texto;    
    articlesModel.create({
        categoryId: category,
        titulo: titulo,
        slug: slugify(titulo),
        body: texto,
    }).then(function (){
        res.redirect("/");
    })
})

//plugando um midwares em uma rota
rotaArticles.get("/admin/artigos/listar", adminLoguin, (req, res) => {
    articlesModel.findAll({
        include: [
            {model: categoryModel}
        ]
    }).then(function (dadosArtigo){
        console.log(categoryModel.titulo)
        res.render('admin/artigos/listar', {
            dadosArtigo: dadosArtigo,
            
        })
    }).catch(function (err) {
        console.log(err);
    })
})

rotaArticles.post("/artigos/editar", adminLoguin, (req, res)=>{
    var codArtigo = req.body.CodArtigo;
    console.log(codArtigo);
    articlesModel.findOne({
        where: {id: codArtigo}
    }).then(function (dadosArtigo){
        categoryModel.findAll().then(function (dadosCategoria){
            res.render('admin/artigos/editar', {dadosArtigo: dadosArtigo, dadosCategoria: dadosCategoria})
        })
        
    })
})

rotaArticles.post("/artigos/atualizar", adminLoguin, (req, res)=>{
    var titulo = req.body.titulo;
    var corpo = req.body.corpo;
    var id = req.body.id;
    articlesModel.update(
        {titulo: titulo, body: corpo, slug: slugify(titulo)},
        {where: {id: id}}
    ).then(function (){
        res.redirect("/admin/artigos/listar");
        
    })
})
//criando paginação
rotaArticles.get('/artigos/page/:num', function (req, res) {
    var num = req.params.num;
    var offset = 0;
    if(num < 0){
        num = 0;
    }
    if(isNaN(num) || num == 1) {
        offset = 0;
        console.log("offset: "+offset);
    }else{
        offset = parseInt(num) * 4;
        if(offset > 4){
            offset = offset - 4;
        }
    }

    articlesModel.findAndCountAll({
        //mimit define a quantidade de dados a ser exibido
        limit: 4,
        offset: offset

    }).then(function (artigos){
        var next;
        if(offset + 4 >= artigos.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next: next,
            artigos: artigos
        }
        categoryModel.findAll().then(function(dadosCategoria){
            res.render("admin/artigos/pages", {result: result, dadosCategoria: dadosCategoria, artigos: artigos, num: num});
        })

        
    })
})

module.exports = rotaArticles;