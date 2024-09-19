var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
require('dotenv').config();


var {Pool,Client} = require("pg")


router.post('/', function(req, res, next) {
  console.log(req.body);

  let mail;
  let password;

  //if formulaire is not empty
  if ( req.body != undefined ) {
    mail = req.body.mail;
    password = req.body.password;

  } else {
    res.render('login',{error:""});
    return;
  }

  //verif user params
  if ( mail == undefined || password == undefined ){
    console.log("Error wrong parameters");
    res.render("login",{error:"Formulaire erroné"});
    return;
  }

  //verif if true email
  if ( !validateEmail(mail) ) {
    console.log("Not a valid email");
    res.render("login",{error:"Email non valide"});
    return;
  }

  //Hash password
  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(password,salt);

//Database connexion
  var pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT_DB,
    database: process.env.DATABASE
  });
  console.log(process.env.PORT_DB);

  pool.connect()
  .then(() => console.log("Connected to the database"))
  .then(function () {

    //TO-do connexion et vérification
    let success = false;

//CHECK PARTICULIER aka Livreur
    pool.query("SELECT MotDePasse FROM particulier WHERE Mail = $1",[mail])
    .then(function(result,err) {

            console.log("Test 1");
            if (result.rows[0] != undefined && result.rows[0].motdepasse != undefined) {
              let resultPasswordHashed = result.rows[0].motdepasse;
              if ( bcrypt.compareSync(password,resultPasswordHashed) ){
                success = true;
              }
            }

            if ( !success ){
              console.log("Pas un compte livreur");

//CHECK COMERCANT

              var pool = new Pool({
                user: process.env.USER,
                password: process.env.PASSWORD,
                host: process.env.HOST,
                port: process.env.PORT_DB,
                database: process.env.DATABASE
              });
              pool.connect()
              .then( function() {
                pool.query("SELECT MotDePasse FROM commercant WHERE Mail = $1",[mail])
                .then(function(result,err) {

                  console.log("Test 2");
                  if (result.rows[0] != undefined && result.rows[0].motdepasse != undefined) {
                    let resultPasswordHashed = result.rows[0].motdepasse;
                    if ( bcrypt.compareSync(password,resultPasswordHashed) ){
                      success = true;
                    }
                  }

                  if ( !success ) {
                    console.log("Pas un compte commercant");

  //CHECK PRODUCTEUR
                    var pool = new Pool({
                      user: process.env.USER,
                      password: process.env.PASSWORD,
                      host: process.env.HOST,
                      port: process.env.PORT_DB,
                      database: process.env.DATABASE
                    });

                    pool.connect()
                    .then( function() {
                      pool.query("SELECT MotDePasse FROM producteur WHERE Mail = $1",[mail])
                      .then(function(result,err) {

                        console.log("Test 3");
                        if (result.rows[0] != undefined && result.rows[0].motdepasse != undefined) {
                          let resultPasswordHashed = result.rows[0].motdepasse;
                          if ( bcrypt.compareSync(password,resultPasswordHashed) ){
                            success = true;
                          }
                        }

                        if ( !success ){
                          console.log("Pas un compte producteur");
                          res.render("login",{error:"Mauvais email ou mot de passe"});

                        } else {
                          console.log("Compte producteur succès !");

                          var pool = new Pool({
                            user: process.env.USER,
                            password: process.env.PASSWORD,
                            host: process.env.HOST,
                            port: process.env.PORT_DB,
                            database: process.env.DATABASE
                          });

                          pool.connect()
                          .then( function() {
                            pool.query("SELECT * FROM producteur WHERE Mail = $1",[mail])
                            .then(function(result,err) {
                                req.session.identifiant = result.rows[0].idproducteur;
                                req.session.connected = true;
                                req.session.name = result.rows[0].nom;
                                req.session.surname = result.rows[0].prenom;
                                req.session.mail = result.rows[0].mail;
                                req.session.phone = result.rows[0].tel;
                                req.session.password = result.rows[0].motdepasse;
                                req.session.role = "Producteur";

                                res.redirect('/');

                              })
                            .catch((e) => console.log(e));
                          })
                          .catch((e) => console.log(e));

                        }

                      })
                      .catch((e) => console.log(e));
                    })
                    .catch((e) => console.log(e));

                  } else {
                    console.log("Compte commercant succès !");
                    var pool = new Pool({
                      user: process.env.USER,
                      password: process.env.PASSWORD,
                      host: process.env.HOST,
                      port: process.env.PORT_DB,
                      database: process.env.DATABASE
                    });
                    pool.connect()
                    .then( function() {
                      pool.query("SELECT * FROM commercant WHERE Mail = $1",[mail])
                      .then(function(result,err) {
                          console.log(result.rows);
                          req.session.identifiant = result.rows[0].idcommercant;
                          req.session.connected = true;
                          req.session.name = result.rows[0].nom;
                          req.session.surname = result.rows[0].prenom;
                          req.session.mail = result.rows[0].mail;
                          req.session.phone = result.rows[0].tel;
                          req.session.password = result.rows[0].motdepasse;
                          req.session.role = "Commercant";

                          res.redirect('/');

                        })
                      .catch((e) => console.log(e));
                    })
                    .catch((e) => console.log(e));

                  }

                })
                .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));

            } else {
              console.log("Compte livreur succès !");

              var pool = new Pool({
                user: process.env.USER,
                password: process.env.PASSWORD,
                host: process.env.HOST,
                port: process.env.PORT_DB,
                database: process.env.DATABASE
              });

              pool.connect()
              .then( function() {
                pool.query("SELECT * FROM particulier WHERE Mail = $1",[mail])
                .then(function(result,err) {
                    req.session.identifiant = result.rows[0].idparticulier;
                    req.session.connected = true;
                    req.session.name = result.rows[0].nom;
                    req.session.surname = result.rows[0].prenom;
                    req.session.mail = result.rows[0].mail;
                    req.session.phone = result.rows[0].tel;
                    req.session.distance = result.rows[0].rayon;
                    req.session.vehicule = result.rows[0].typevehicule;
                    req.session.password = result.rows[0].motdepasse;
                    req.session.role = "Livreur";
                    req.session.disponible = result.rows[0].disponible;

                    res.redirect('/');

                  })
                .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));

            }
          })
          .catch((e) => console.log(e));

        

      

      pool.end()
    })
    .catch((e) => console.log(e))

  



});

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

router.get('/',function(req,res,next) {
  res.render('login',{error:""});
});

module.exports = router;
