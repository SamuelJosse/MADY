var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if(req.session.connected !== undefined){
    req.session.destroy();
  }
  res.redirect('/');
});
router.post('/', function(req, res, next) {
  if(req.session.connected !== undefined){
    req.session.destroy();
  }
  res.redirect('/');
});

module.exports = router;
