var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

  if ( req.session.connected) {
    if(req.session.role == "Livreur") {
      res.render('map',{name:req.session.name,surname:req.session.surname,role:req.session.role, dispo: req.session.disponible});
    } else {
      res.render("forbidden");
    }
  } else {
    res.render("forbidden");
  }
});
router.get('/', function(req, res, next) {
  if ( req.session.connected) {
    if(req.session.role == "Livreur") {
      res.render('map',{name:req.session.name,surname:req.session.surname,role:req.session.role, dispo: req.session.disponible});
    } else {
      res.render("forbidden");
    }
  } else {
    res.render("forbidden");
  }
});
module.exports = router;
