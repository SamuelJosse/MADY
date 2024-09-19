var express = require('express');
var router = express.Router();
require('dotenv').config();

//Database credentials
var {Pool,Client} = require("pg")

router.get('/', function(req, res, next) {
    console.log("1");
    console.log(req.query.liste);
    if (req.session.connected == true ) {
        console.log("Pool");
        var pool = new Pool({
            user: process.env.USER,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT_DB,
            database: process.env.DATABASE
        });
        if( req.session.role == "Producteur") {
            console.log("Producteur");
            pool.connect()
                    .then(() => console.log("Connected to the database"))
                    .then(function () {
                        console.log("eee");
                        if(req.query.liste == "tout" || req.query.liste == undefined ) {
                            pool.query("SELECT idcommande,Commercant.societe,volumecommande,etat,qrcode FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idproducteur = $1",[req.session.identifiant])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(5);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                        tab[i][4] = result.rows[i]["qrcode"];
                                    }
                                    res.render('commandes', {tab:tab,type:"producteur",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    res.render('index', {comm:"commercant",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien prod"); //fdf
                                }
                            })
                            .catch(e => console.log("ERREUR prod :"+e));
                        }else {
                            pool.query("SELECT idcommande,Commercant.societe,volumecommande,etat,qrcode FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idproducteur = $1 and etat = $2",[req.session.identifiant,req.query.liste])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(5);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                        tab[i][4] = result.rows[i]["qrcode"];
                                    }
                                    res.render('commandes', {tab:tab,type:"producteur",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    res.render('index', {comm:"commercant",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien prod"); //fdf
                                }
                            })
                            .catch(e => console.log("ERREUR prod :"+e))
                        }
                    })
                    .catch(e => console.log("ERREUR prod2 :"+e));
        } else if(req.session.role == "Commercant"){
            console.log("Commercant");
            pool.connect()
                    .then(() => console.log("Connected to the database"))
                    .then(function () {
                        console.log(req.session.identifiant);
                        if(req.query.liste == "tout" || req.query.liste == undefined ) {
                            pool.query("SELECT idcommande,Producteur.societe,volumecommande,etat FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idcommercant = $1",[req.session.identifiant])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(4);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                    }
                                    res.render('commandes', {tab:tab,type:"commercant",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    res.render('index', {comm:"producteur",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien comm");
                                }
                            })
                            .catch(e => console.log("ERREUR comm :"+e));
                        } else {
                            pool.query("SELECT idcommande,Producteur.societe,volumecommande,etat FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idcommercant = $1 and etat = $2",[req.session.identifiant,req.query.liste])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(4);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                    }
                                    res.render('commandes', {tab:tab,type:"commercant",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    res.render('index', {comm:"producteur",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien comm");
                                }
                            })
                            .catch(e => console.log("ERREUR comm :"+e));
                        }
                    })
                    .catch(e => console.log("ERREUR comm2 :"+e));
        } else {
            res.render("forbidden");
        } 
    } else {
        res.render("forbidden");
    }
});

router.post('/',function(req,res,next) {

    console.log(req.body.liste);
    console.log(req.session.connected);
    if (req.session.connected == true ) {
        console.log("Pool");
        var pool = new Pool({
            user: process.env.USER,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT_DB,
            database: process.env.DATABASE
        });
        if( req.session.role == "Producteur") {
            console.log("Producteur");
            pool.connect()
                    .then(() => console.log("Connected to the database"))
                    .then(function () {
                        if(req.body.liste == "tout" || req.body.liste == undefined ) {
                            pool.query("SELECT idcommande,Commercant.societe,volumecommande,etat,qrcode FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idproducteur = $1",[req.session.identifiant])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    //Producteur has commands
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(5);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                        tab[i][4] = result.rows[i]["qrcode"];
                                    }
                                    res.render('commandes', {tab:tab,type:"producteur",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    //No commands
                                    res.render('index', {comm:"producteur",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("No commands for producteur"); //fdf
                                }
                            })
                            .catch(e => console.log("ERREUR prod :"+e));
                        } else {
                            pool.query("SELECT idcommande,Commercant.societe,volumecommande,etat,qrcode FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idproducteur = $1 and etat = $2",[req.session.identifiant,req.body.liste])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    //Producteur has commands
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(5);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                        tab[i][4] = result.rows[i]["qrcode"];
                                    }
                                    res.render('commandes', {tab:tab,type:"producteur",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    //No commands
                                    res.render('index', {comm:"producteur",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("No commands for producteur 2"); //fdf
                                }
                            })
                            .catch(e => console.log("ERREUR prod :"+e));
                        }
                    })
                    .catch(e => console.log("ERREUR prod2 :"+e));
        } else if( req.session.role == "Commercant") {
            console.log("Commercant");
            pool.connect()
                    .then(() => console.log("Connected to the database"))
                    .then(function () {
                        console.log(req.session.identifiant);
                        if(req.body.liste == "tout" || req.body.liste == undefined ) {
                            pool.query("SELECT idcommande,Producteur.societe,volumecommande,etat FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idcommercant = $1",[req.session.identifiant])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    //Commercant has command to receiv
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(4);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                    }
                                    res.render('commandes', {tab:tab,type:"commercant",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    //No command to receiv
                                    res.render('index', {comm:"commercant",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien comm");
                                }
                            })
                            .catch(e => console.log("ERREUR comm :"+e));
                        } else {
                            pool.query("SELECT idcommande,Producteur.societe,volumecommande,etat FROM Commande,Commercant,Producteur where lecommercant = idcommercant and leproducteur = idproducteur and idcommercant = $1",[req.session.identifiant,req.body.liste])
                            .then(function(result,err){
                                if ( result.rowCount != 0 ) {
                                    //Commercant has command to receiv
                                    var tab = new Array(result.rowCount);
                                    for (var i = 0; i < result.rowCount; i++) {
                                        tab[i] = new Array(4);
                                        tab[i][0] = result.rows[i]["idcommande"];
                                        tab[i][1] = result.rows[i]["societe"];
                                        tab[i][2] = result.rows[i]["volumecommande"];
                                        tab[i][3] = result.rows[i]["etat"];
                                    }
                                    res.render('commandes', {tab:tab,type:"commercant",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role});
                                } else {
                                    //No command to receiv
                                    res.render('index', {comm:"commercant",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                                    console.log("Rien comm");
                                }
                            })
                            .catch(e => console.log("ERREUR comm :"+e));
                        }
                    })
                    .catch(e => console.log("ERREUR comm2 :"+e));
        } else {
            res.render("forbidden");
        }   
    }

});
module.exports = router;


/**
 * <ul>
           <% for (var i = 0; i < result.rowCount; i++) {
                <li><%= result.rows[i]["IdCommande"] %> </li>
            <% }; %>
          </ul>
 */