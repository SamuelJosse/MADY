var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
require('dotenv').config();

//Database credentials
var {Pool,Client} = require("pg")


/**
 * When user press submit
 */
router.post('/', function(req, res, next) {

  if ( req.body != undefined ) {
    console.log(78)
    let name = req.body.name;
    let surname = req.body.surname;
    let mail = req.body.mail;
    let phone = req.body.phone;
    let distance = req.body.distance;
    let vehicule = req.body.vehicule;
    let password = req.body.password;
    let repassword = req.body.repassword;
    let role = req.body.role;
    let societe = req.body.societe;

    if ( name != undefined && surname != undefined && mail != undefined && role != undefined && phone != undefined && password != undefined && repassword != undefined ) {
      //passwords are the sames
      if ( password == repassword ) {

        //Hash password
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password,salt);

        if ( validateEmail(mail) ) {

          //TO-do connction et insertion
          let pool = new Pool({
            user: process.env.USER,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT_DB,
            database: process.env.DATABASE
          });
          pool.connect()
          .then(() => console.log("Connected to the database"))
          .then( function() {

            if ( role == "Livreur" ){
              pool.query("SELECT Mail FROM particulier WHERE Mail = $1",[mail])
              .then(function(result,err){

                if ( result.rowCount == 0 ) {
                    console.log("ok email livreur");

                    //Type of vehicule
                    //1 for vélo
                    //2 for Moto
                    //3 for Voiture
                    //4 for Camion

                    let vehiculeID = 1;
                    if ( vehicule == "Vélo" )
                      vehiculeID = 1;
                    else if ( vehicule == "Moto" )
                      vehiculeID = 2;
                    else if ( vehicule == "Voiture" )
                      vehiculeID = 3;
                    else
                      vehiculeID = 4;

                      pool = new Pool({
                        user: process.env.USER,
                        password: process.env.PASSWORD,
                        host: process.env.HOST,
                        port: process.env.PORT_DB,
                        database: process.env.DATABASE
                      });
                      pool.connect()
                      .then( function() {
                        pool.query("INSERT INTO particulier (Nom,Prenom,Rayon,Mail,MotDePasse,Points,TypeVehicule,Tel,Disponible) VALUES ($1,$2,$3,$4,$5,0,$6,$7,true)",[name,surname,distance,mail,hashedPassword,vehiculeID,phone])
                        .then(() => { console.log("Compte livreur créé")
                            pool = new Pool({
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
                        })
                        .catch( e => console.log("Error livreur account" + e));
                        //res.redirect("/");
                      })
                      .catch(e => console.log("error connect to database"))



                } else {
                  console.log("Email already used");
                  res.render("sign",{error:"Email déja utilisé"});
                }


              })
              .catch(e => console.log("Error select mail livreur: " + e))
            } else if ( role == "Commerçant" ){

              //check if societe already exists

              pool.query("SELECT COUNT(Societe) FROM commercant WHERE Societe = $1",[societe])
              .then(function(result){
                  if (result){
                    if ( result.rows[0]["count"] != 0 )
                    res.render("sign",{error:"Nom de société déja utilisé"});
                  }
              })
              .catch(e => console.log("Error commercant societe : ",e));



              pool.query("SELECT Mail FROM commercant WHERE Mail = $1",[mail])
              .then(function(result,err){

                if ( result.rowCount == 0 ) {
                  console.log("ok email commerçant");

                  pool = new Pool({
                    user: process.env.USER,
                    password: process.env.PASSWORD,
                    host: process.env.HOST,
                    port: process.env.PORT_DB,
                    database: process.env.DATABASE
                  });
                  pool.connect()
                  .then( function() {
                    pool.query("INSERT INTO commercant (Nom,Prenom,AdresseDest,MotDePasse,Mail,Tel,Societe) VALUES ($1,$2,'rue de base',$3,$4,$5,$6)",[name,surname,hashedPassword,mail,phone,societe])
                    .then(() => { console.log("Compte commercant créé")
                        pool = new Pool({
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
                              req.session.societe = result.rows[0].societe;
                              req.session.role = "Commercant";

                              res.redirect('/');

                            })
                          .catch((e) => console.log(e));
                        })
                        .catch((e) => console.log(e));

                    })
                    .catch( e => console.log("Error commercant account"));
                    //res.redirect("/");
                  })

                } else {
                  console.log("Email already used");
                  res.render("sign",{error:"Email déja utilisé"});
                }


              })
              .catch(e => console.log("Error select mail commecant: " + e))
            } else {

              pool.query("SELECT COUNT(Societe) FROM producteur WHERE Societe = $1",[societe])
              .then(function(result){
                  if (result){
                    if ( result.rows[0]["count"] != 0 )
                    res.render("sign",{error:"Nom de société déja utilisé"});
                  }
              })
              .catch(e => console.log("Error producteur societe : ",e));

              pool.query("SELECT Mail FROM producteur WHERE Mail = $1",[mail])
              .then(function(result,err){

                if ( result.rowCount == 0 ) {
                  console.log("ok email producteur");

                  pool = new Pool({
                    user: process.env.USER,
                    password: process.env.PASSWORD,
                    host: process.env.HOST,
                    port: process.env.PORT_DB,
                    database: process.env.DATABASE
                  });
                  pool.connect()
                  .then( function() {
                      pool.query("INSERT INTO producteur (Nom,Prenom,Societe,AdresseSource,Mail,MotDePasse,Tel) VALUES ($1,$2,$3,'rue de base',$4,$5,$6)",[name,surname,societe,mail,hashedPassword,phone])
                      .then(() => { console.log("Compte producteur créé")
                            pool = new Pool({
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
                                  req.session.societe = result.rows[0].societe;
                                  req.session.role = "Producteur";

                                  res.redirect('/');

                                })
                              .catch((e) => console.log(e));
                            })
                            .catch((e) => console.log(e));

                      })
                      .catch( e => console.log("Error producteur account"));
                      //res.redirect("/");
                  })

                } else {
                  console.log("Email already used");
                  res.render("sign",{error:"Email déja utilisé"});
                }


              })
              .catch(e => console.log("Error select mail producteur: " + e))
            }

          })
          .catch(e => console.log("Error connection to the database failed"))
          .finally(() => pool.end());

        } else {
          //Not valid email
          console.log("Invalid email");
          res.render("sign",{error:"Mauvais mot de passe ou email"});
        }
      } else {
        //Not the same passwords
        res.render("sign",{error:"Mauvais mot de passe ou email"});
      }
    } else {
      //Wrong parameters
      res.render("sign",{error:"Formulaire incomplet"});
    }


  } else {
    res.render('sign',{error:""});
  }

});

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


/**
* Basic display of the page
*/
router.get('/', function(req, res, next) {
  console.log(req)
  res.render('sign',{error:""});
});


module.exports = router;
