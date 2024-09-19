var express = require('express');
var router = express.Router();
require('dotenv').config();


var {Pool,Client} = require("pg")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('qrViewer', {comm:"rien",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});

});

router.post('/', async function(req, res, next) {
    console.log(req.body.commandTimestamp);
    console.log("Numéro de commande :  " + req.body.commandTimestamp);

    if ( !req.session.connected) {
        res.render("forbidden"); 
    }

    if ( req.session.role != "Livreur" && req.session.role != "Commercant" ) {
        res.render("forbidden"); 
    }

    var pool = new Pool({
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.PORT_DB,
        database: process.env.DATABASE
    });

    pool.connect()
    .then(() => console.log("Connected to the database"))
    .then(function () {
        if ( req.session.role == "Livreur" ) {
            pool.query("UPDATE commande SET etat=$1 WHERE qrcode = $2",["prise",req.body.commandTimestamp])
            .then(function(result,err) {
                return res.render('index', {comm:"notifL",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
                //res.redirect('/');
            })
            .catch( function (e) {
                console.log("update etat error");
                res.render('index', {comm:"notifE",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
           });
        } else {
            pool.query("UPDATE commande SET leparticulier = null, etat=$1 WHERE qrcode = $2 ",["livre",req.body.commandTimestamp])
            .then(function(result,err) {
                return res.render('index', {comm:"notifC",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
            })
            .catch( function (e) {
                 console.log("update etat commercial Comm error");
                 res.render('index', {comm:"notifE",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
            });
            pool.query("UPDATE particulier SET disponible = true FROM commande WHERE particulier.idparticulier = commande.leparticulier and commande.qrcode = $1",[req.body.commandTimestamp])
            .then(function(result,err) {
                return res.render('index', {comm:"notifC",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
            })
            .catch( function (e) {
                 console.log("update etat commercial Part error");
                 res.render('index', {comm:"notifE",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
            });
        }
    })
    .catch (e => {
        console.log("Connetion to database failed !");
    });
});

module.exports = router;
