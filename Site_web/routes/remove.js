var express = require('express');
var router = express.Router();
require('dotenv').config();
var {Pool,Client} = require("pg")

router.get('/', function(req, res, next) {
  if (req.session.connected == true ) {
    console.log("Get remove");
    res.redirect("/");
  } else {
    res.render('forbidden');
  }

});


router.post('/',function(req,res,next) {

  if (req.session.connected == true ) {

    if ( req.session.role == "Livreur" ) {
      console.log("Livreur account");
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

          pool.query("SELECT idParticulier FROM particulier WHERE mail =$1",[req.session.mail])
          .then(function(result,err) {
            let idLivreur = result.rows[0]["idparticulier"];
            console.log("Get livreur id : " + idLivreur);
            var pool = new Pool({
              user: process.env.USER,
              password: process.env.PASSWORD,
              host: process.env.HOST,
              port: process.env.PORT_DB,
              database: process.env.DATABASE
            });
            pool.connect()
            .then( function() {
              pool.query("select nb_commandes($1)",[idLivreur])
              .then(function(result,err) {

                console.log("commandes :"+result.rows[0]["nb_commandes"]);
                if (result.rows[0]["nb_commandes"] != 0) {
                  console.log("Commande(s) detecte");
                  res.render('setting',{error:"Vous devez finir vos missions avant de pouvoir supprimer votre compte",name:req.session.name,surname:req.session.surname,mail:req.session.mail,phone:req.session.phone,role:req.session.role})
                } else {
                  console.log("Pas de commandes");
                  var pool = new Pool({
                    user: process.env.USER,
                    password: process.env.PASSWORD,
                    host: process.env.HOST,
                    port: process.env.PORT_DB,
                    database: process.env.DATABASE
                  });
                  pool.connect()
                  .then( function() {
                    pool.query("DELETE FROM associationtrajet WHERE CleParticulier=$1",[idLivreur])
                    .then(function() {
                      console.log("Deleting associationtrajet that match livreur");
                      var pool = new Pool({
                        user: process.env.USER,
                        password: process.env.PASSWORD,
                        host: process.env.HOST,
                        port: process.env.PORT_DB,
                        database: process.env.DATABASE
                      });
                      pool.connect()
                      .then( function() {
                        pool.query("DELETE FROM particulier WHERE idParticulier=$1",[idLivreur])
                        .then(function() {
                          console.log("Livreur account deleted");
                          req.session.destroy((err) => {
                            console.log("ERR",err);
                            res.redirect('/');
                          })
                        })
                        .catch( e => console.log("Error deleting livreur account"))
                      })


                    })
                    .catch(e => console.log("Error deleting livreur trajets"))
                  })

                }
              })

            })
          .catch( e => console.log("Error get livreur id "))
      });
    });

    } else if ( req.session.role == "Commercant") {
      console.log("Commercant account");

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

          pool.query("DELETE FROM commercant WHERE mail = $1",[req.session.mail])
          .then( () => console.log("Deleted commercant"))
          .then(function() {
              req.session.connected = undefined;
              req.session.destroy();

              res.redirect('/');
          })
          .catch( e => console.log("Error delete commercant"))

      });


    } else {
      console.log("Producteur account");

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

          pool.query("DELETE FROM producteur WHERE mail = $1",[req.session.mail])
          .then( () => console.log("Deleted producteur"))
          .then(function() {
            req.session.connected = undefined;
            req.session.destroy();

            res.redirect('/');
          })
          .catch( e => console.log("Error delete producteur"))


      });


    }


    //res.redirect("/");
  } else {
     res.render('forbidden');
  }

 });



module.exports = router;
