const express = require('express');
const bcryptjs = require('bcryptjs');
const rotaUsuario = express.Router();
const modeUsuario = require('./UserModel');

rotaUsuario.get('/admin/users', function (req, res) {
    
    modeUsuario.findAll().then(function (dadosUsuario){
        res.render('admin/users/listar', {dadosUsuario: dadosUsuario});
    }).catch(function (err){
        res.redirect("/")
    })
    
})

rotaUsuario.get('/loguin', function (req, res){    
        res.render('admin/users/loguin');
})

rotaUsuario.get('/logout', function (req, res){    
    req.session.user = undefined;
    res.redirect("/")
})

rotaUsuario.post('/logar', function (req, res){    
    var email = req.body.email;
    var senha = req.body.senha;
    modeUsuario.findOne({
        where:{
            nome: email,            
        }
    }).then(function (dadosUsuarios){
        if(dadosUsuarios != undefined){
            //usando o bcryptjs para compara a senha digitada com a senha que esta hash no banco de dados
            var comparaSenha = bcryptjs.compareSync(senha, dadosUsuarios.senha);
            if(comparaSenha){
                req.session.user = {
                    id: dadosUsuarios.id,
                    email: dadosUsuarios.nome
                }
                res.redirect("/");
            }else{
                res.redirect("/loguin")
            }
        }else{
            res.redirect("/loguin")
        }
    })
})


rotaUsuario.get('/admin/users/new', function (req, res){
    var duplicado = "";
    res.render("admin/users/new", {duplicado: duplicado});
})

rotaUsuario.post('/admin/users/salvar', function (req, res){
    var email = req.body.email;
    var senha = req.body.senha;
    var duplicado = ":duplicado";

    modeUsuario.findOne({
        where:{nome: email}
    }).then(user => {
        if(user == undefined){
            var salt = bcryptjs.genSaltSync(10);
            var hash = bcryptjs.hashSync(senha, salt);

            modeUsuario.create({
                nome: email,
                senha: hash
            }).then(function (){
                res.redirect('/admin/users/new');
            }).catch(function (err){
                res.render('/admin/users/new', {duplicado: duplicado});
            })
        }else{
        res.render('admin/users/new', {duplicado: duplicado});
        }
    })
    
})

module.exports = rotaUsuario;