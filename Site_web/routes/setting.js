var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
require('dotenv').config();

var {Pool,Client} = require("pg")


router.get('/', function(req, res, next) {
  if (req.session.connected == true ) {
    res.render('setting',{error:"",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role,distance:req.session.distance,vehicule:req.session.vehicule});
  } else {
    res.render('forbidden');
  }

});


router.post('/',function(req,res,next) {

  if (req.session.connected == true ) {


      if ( req.body != undefined ) {
        console.log(req.body);

        if ( req.body.name != undefined ) {
          //Form 1 for username name mail ...

            let goodArgs = false;
            //if particulier aka livreur
            if ( req.session.role == "Livreur" ) {
              if ( req.body.surname != undefined && req.body.name != undefined && req.body.mail != undefined && req.body.phone != undefined && req.body.distance != undefined && req.body.vehicule ){
                goodArgs = true;
              }
            } else {
              if ( req.body.surname != undefined && req.body.name != undefined && req.body.mail != undefined && req.body.phone != undefined ){
                goodArgs = true;
              }
            }

            //Arguments are good
            if ( goodArgs ){
              console.log("OK args");

                if ( req.session.role == "Livreur" ) {

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

                    let vehicule = req.body.vehicule;
                    let vehiculeID = 1;
                    if ( vehicule == "Vélo" )
                      vehiculeID = 1;
                    else if ( vehicule == "Moto" )
                      vehiculeID = 2;
                    else if ( vehicule == "Voiture" )
                      vehiculeID = 3;
                    else
                      vehiculeID = 4;

                    pool.query("UPDATE particulier SET Nom=$1, Prenom=$2, Mail=$3, Tel=$4, Rayon=$5, TypeVehicule=$6 WHERE mail = $7",[req.body.name,req.body.surname,req.body.mail,req.body.phone,req.body.distance,vehiculeID,req.session.mail])
                    .then( () => console.log("Updated livreur"))
                    .then(function() {
                      req.session.name = req.body.name;
                      req.session.surname = req.body.surname;
                      req.session.mail = req.body.mail;
                      req.session.phone = req.body.phone;
                      req.session.distance = req.body.distance;
                      req.session.vehicule = req.body.vehicule;
                      res.redirect("/");
                    })
                    .catch( e => res.render('setting',{error:"database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role}))


                   });


                } else if ( req.session.role == "Commercant" ) {

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

                    pool.query("UPDATE commercant SET Nom=$1, Prenom=$2, Mail=$3, Tel=$4 WHERE mail = $5",[req.body.name,req.body.surname,req.body.mail,req.body.phone,req.session.mail])
                    .then( () => console.log("Updated commercant"))
                    .then(function() {
                      req.session.name = req.body.name;
                      req.session.surname = req.body.surname;
                      req.session.mail = req.body.mail;
                      req.session.phone = req.body.phone;
                      res.redirect("/");
                    })
                    .catch( e => res.render('setting',{error:"database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role}))


                   });

                } else if ( req.session.role == "Producteur" ) {
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

                    pool.query("UPDATE producteur SET Nom=$1, Prenom=$2, Mail=$3, Tel=$4 WHERE mail = $5",[req.body.name,req.body.surname,req.body.mail,req.body.phone,req.session.mail])
                    .then(() => console.log("Updated producteur"))
                    .then(function() {
                      req.session.name = req.body.name;
                      req.session.surname = req.body.surname;
                      req.session.mail = req.body.mail;
                      req.session.phone = req.body.phone;
                      res.redirect("/");
                    })
                    .catch( e => res.render('setting',{error:"database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role} ))


                   });
                }


            } else {
              console.log("Error args");
              res.render('setting',{error:"Formulaire incorrect",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
            }

        } else {

          console.log("Form 2");

          let goodArgs = false;

          if ( req.body.pws != undefined && req.body.repws != undefined && req.body.new_pws != undefined ){
            goodArgs = true;
          }

          //Arguments are good
          if ( goodArgs ) {
            console.log("OK args");

//          Good password
            if ( bcrypt.compareSync(req.body.pws,req.session.password) ) {
              console.log("Same pass hash");
              //Same passwords
              if ( req.body.repws == req.body.new_pws) {
                console.log("Same new pass");

                var pool = new Pool({
                  user: process.env.USER,
                  password: process.env.PASSWORD,
                  host: process.env.HOST,
                  port: process.env.PORT_DB,
                  database: process.env.DATABASE
                });

                let salt = bcrypt.genSaltSync(10);
                let hashedPassword = bcrypt.hashSync(req.body.repws,salt);

                pool.connect()
                .then(function () {
                  console.log("Connected to the database")
                  if ( req.session.role == "Livreur" ) {

                    var pool = new Pool({
                      user: process.env.USER,
                      password: process.env.PASSWORD,
                      host: process.env.HOST,
                      port: process.env.PORT_DB,
                      database: process.env.DATABASE
                    });;
                    pool.connect()
                    .then(function() {
                      console.log("Update livreur");
                      pool.query("UPDATE Particulier SET MotDePasse = $1 WHERE mail = $2",[hashedPassword,req.session.mail])
                      .then(() => req.session.password = hashedPassword)
                      .then(() => console.log("Updated particulier password "))
                      .then(() => res.redirect('/'))
                      .catch(e => res.render('setting',{error:"database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role}))
                    })

                  } else if ( req.session.role == "Producteur" ) {
                    var pool = new Pool({
                      user: process.env.USER,
                      password: process.env.PASSWORD,
                      host: process.env.HOST,
                      port: process.env.PORT_DB,
                      database: process.env.DATABASE
                    });
                    pool.connect()
                    .then(function() {
                      pool.query("UPDATE Producteur SET MotDePasse = $1 WHERE mail = $2",[hashedPassword,req.session.mail])
                      .then(() => req.session.password = hashedPassword)
                      .then(() => console.log("Updated producteur password "))
                      .then(() => res.redirect('/'))
                      .catch(e => res.render('setting',{error:"Database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role}))
                    })

                  } else if ( req.session.role == "Commercant" ) {

                    var pool = new Pool({
                      user: process.env.USER,
                      password: process.env.PASSWORD,
                      host: process.env.HOST,
                      port: process.env.PORT_DB,
                      database: process.env.DATABASE
                    });
                    pool.connect()
                    .then(function() {
                      pool.query("UPDATE Commercant SET MotDePasse = $1 WHERE mail = $2",[hashedPassword,req.session.mail])
                      .then(() => req.session.password = hashedPassword)
                      .then(() => console.log("Updated commercant password "))
                      .then(() => res.redirect('/'))
                      .catch(e => res.render('setting',{error:"Database error",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role}))
                    })

                  }
                })
                .catch(e => console.log("Connection to the database failed"))

              } else {
                console.log("Not the same password");
                res.render('setting',{error:"Les mots de passe sont différents",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
              }
            } else {
              console.log("Wrong password");
              res.render('setting',{error:"Mauvais mot de passe",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
            }

          } else {
            console.log("Missing parameters");
            res.render('setting',{error:"Formulaire incorrect",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
          }
        }
    } else {
      console.log("no parameters");
      res.render('setting',{error:"Formulaire incorrect",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
    }
  } else {
    res.render("forbidden");
  }

});

module.exports = router;
