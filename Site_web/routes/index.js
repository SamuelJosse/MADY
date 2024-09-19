var express = require('express');
var router = express.Router();
const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT_DB,
  database: process.env.DATABASE
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.connected !== undefined){
    res.render('index',{comm:"rien",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
  }else{
    res.render('index',{connected:false});
  }
});

router.post('/', function(req, res, next) {
  if(req.session.connected !== undefined){
    res.render('index',{comm:"rien",id:req.session.identifiant,connected:true,name:req.session.name,surname:req.session.surname,role:req.session.role});
  }else{
    res.render('index',{connected:false});
  }
});
// recuperation des postions du producteur
router.get('/api/getPositionColis', function(req, res){
  console.log(req.session.disponible);
  if(req.session.connected) {
    if (!req.session.disponible){
      pool.query("Select * from commande WHERE leparticulier = $1", [req.session.identifiant])
      .then(function(ret, err){
        if(err){
          console.log(err);
          return;
        }
        console.log(ret.rowCount);
        if(ret.rowCount != 0) {
          console.log(ret.rows[0].etat)
          if(ret.rows[0].etat == "selectionne"){
            pool.query("SELECT * FROM producteur WHERE idproducteur = $1", [ret.rows[0].leproducteur])
            .then(function(ret, err){
              res.send(200, [ret.rows[0].long, ret.rows[0].lat])
            })
          }else if(ret.rows[0].etat == "prise"){
            pool.query("SELECT * FROM commercant WHERE idcommercant = $1", [ret.rows[0].lecommercant])
            .then(function(ret, err){
              res.send(200, [ret.rows[0].long, ret.rows[0].lat])
            })
          } 
        }else {
          console.log("ERREUR");
        }
      })
    } else{
      res.send(200, [])
    }
  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})
// validation de prise de colis
router.get('/api/validateColis', function(req, res){
  if(req.session.connected){
    pool.query("UPDATE commande SET leparticulier = $1, etat = $2 WHERE idcommande = $3", [req.query.idparticulier,"selectionne", req.query.idcommande])
    .then(function(ret, err){
      if(err){
        console.log(err);
        return;
      }
      console.log("ok")
    })
    .then(function(){
      pool.query("UPDATE particulier SET disponible = $1 WHERE idparticulier = $2", [false,req.query.idparticulier])
      .then(function(ret, err){
        if(err){
          console.log(err);
          return;
        }
        console.log("ok")
      })
      .then(function(){
        req.session.disponible = false;
        req.session.idcommande = req.query.idcommande;
        console.log("ok")
        res.send(200, {message: 'ok'})
      })
    })

  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})

//Récupération des livraison
router.get('/api/setLivraison', function(req, res){
  if(req.session.connected){
    console.log(req.query);
    colis_vus = JSON.parse(req.query.colis_vus);
    console.log(colis_vus);
    if(colis_vus === undefined){
      return res.send(500, {message: 'error'})
    }
    for(var i=0; i < colis_vus.length; i++) {
      pool.query("UPDATE commande SET etat = $1 WHERE idcommande = $2",["notifie", colis_vus[i]])
      .then(function(ret, err){
      if(err){
        console.log(err);
        return;
      }
      return res.send(200)
      })
    }
  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})
router.get('/api/livraison', function(req, res){
  if(req.session.connected){
    pool.query("SELECT * from Commande WHERE leparticulier IS NULL and etat = $1 or etat = $2",["existe","notifie"])
    .then(function(ret, err){
      if(err){
        console.log(err);
        return;
      }
      return res.send(200, {data: ret['rows']})
    })
  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})
router.get('/api/user', function(req, res){
  if(req.session.connected){
    pool.query("SELECT * from Particulier WHERE idparticulier = $1", [req.session.identifiant])
    .then(function(ret, err){
      if(err){
        console.log(err);
        return;
      }
      return res.send(200, {user: ret['rows']})
    })
  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})
router.get('/api/producer', function(req, res){
  if(req.session.connected){
    pool.query("SELECT * from Producteur WHERE idproducteur = $1", [req.query.id])
    .then(function(ret, err){
      if(err){
        console.log(err);
        return;
      }
      return res.send(200, {producer: ret['rows']})
    })
  }else{
    return res.send(500, {message: 'pas connecté'})
  }
})
module.exports = router;
