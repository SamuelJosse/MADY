var express = require('express');
var router = express.Router();


/*const {getDistance, convertDistance} = require('geolib')


let distance = getDistance(livreurCoord,productCoord,100)
console.log(convertDistance(distance, 'km'))

console.log(convertDistance(distance, 'km'))*/




router.get('/', function(req, res, next) {
  const {getDistance, convertDistance} = require('geolib');
  const livreurCoord = {latitude : req.query.latitude, longitude : req.query.longitude};
  const productCoord = {latitude : req.query.latitude, longitude : req.query.longitude};
  let distance = getDistance(livreurCoord,productCoord,100);
  console.log("Distance : " + convertDistance(distance, 'km') + " km")
 
});
module.exports = router;



