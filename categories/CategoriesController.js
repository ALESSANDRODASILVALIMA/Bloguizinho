const express = require('express');
const slugify = require('slugify');
const rotaCategories = express.Router();
const categoriaModel = require('./CategoryModel');

rotaCategories.get('/admin/categorias/new', (req, res) => {
    res.render('admin/categorias/new');
})

rotaCategories.post('/admin/categorias/deletar', (req, res) => {
    var id = req.body.id; 
    //senao for um numero
        if(id != ""){
            categoriaModel.destroy({
                where: {
                 id: id
                 }
            }).then(function () {
            res.redirect('/admin/categorias/listar'); 
            })
        }else{
        res.redirect('/admin/categorias/listar'); 
        }
    }
)

rotaCategories.get('/admin/categorias/listar', (req, res) => {
    categoriaModel.findAll({
        attribute: ["id", "titulo", "slug"],
    }).then((categories) => {
        res.render('admin/categorias/listar',{
            dadosCategies: categories
        });        
    })    
})

rotaCategories.post('/categorias/salvar', (req, res) => {
    var titulo = req.body.titulo; 
    if(titulo != undefined) {
        categoriaModel.create({
            titulo: titulo,
            slug: slugify(titulo)
        }).then(() => {
            res.redirect('/admin/categorias/listar'); 
        }) 
    }else{
        res.redirect('/admin/categorias/new'); 
    }
})

rotaCategories.get("/admin/categorias/editar/:id", (req, res) => {

    var id = req.params.id;
    if(isNaN(id)){
        
        res.redirect('/admin/categorias/listar'); 
    }else{
    
        categoriaModel.findByPk(id).then(function (dados){
            if(dados != undefined){
               res.render("admin/categorias/editar", { 
                   dados : dados,
                });
            }else{
               res.redirect('/admin/categorias/listar'); 
            }
        })
    }        
})

rotaCategories.post("/categorias/atualizar", (req, res) => {
    var id = req.body.id;
    var titulo = req.body.titulo;
    categoriaModel.update({
        titulo: titulo,
        slug:  slugify(titulo),
        }, {
        where: {
          id : id,
        }
      }).then(() => {
        res.redirect('/admin/categorias/listar');  
      }).catch((erro) => {
          res.send("Erro"+erro)
      })
})
module.exports = rotaCategories;