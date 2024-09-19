mapboxgl.accessToken = 'pk.eyJ1IjoibWV2IiwiYSI6ImNraW5mdmhhZjEydHMydXFqa2dzcDVjMXgifQ.KiYKwJvO6PeIQQ3lUCu1Qg';
navigator.geolocation.getCurrentPosition(success, error, options);
var long;
var lat;


async function success(pos) {
  var crd = pos.coords;
  long = crd.longitude;
  lat = crd.latitude;
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [crd.longitude, crd.latitude], // starting position [lng, lat]
    zoom: 12 // starting zoom
  });
  var canvas = map.getCanvasContainer();
  var start = [long, lat];
  var endcoords = await getPosition();
  if(endcoords[0] === undefined){
    endcoords = [long, lat]
  }
  // create a function to make a directions request
  function getRoute(endcoords) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + endcoords[0] + ',' + endcoords[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() {
      var json = JSON.parse(req.response);
      var data = json.routes[0];
      var route = data.geometry.coordinates;
      var geojson = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': geojson
              }
            }
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      } 
      // get the sidebar and add the instructions
      var instructions = document.getElementById('instructions');
      var steps = data.legs[0].steps;

      var tripInstructions = [];
      for (var i = 0; i < steps.length; i++) {
        tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
        instructions.innerHTML = '<br><span class="duration">Temps Restant: ' + Math.floor(data.duration / 60) + ' min  </span>' + tripInstructions;
      }
     
      // add turn instructions here at the end
    };
    req.send();
  }

  map.on('load', function() {
    getRoute(start)
    canvas.style.cursor = '';
    // Add starting point to the map
    map.addLayer({
      id: 'start',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });
    getRoute(endcoords);
      // Add destination to the map
      map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': {
             'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': endcoords
                }
              }
            ]
          }
        },
          'paint': {
            'circle-radius': 10,
            'circle-color': '#e74c3c'
          }
        })
        const coordsColis = JSON.parse(localStorage.getItem("coordsColis"));
        //generate cercle for producer
        coordsColis.forEach(element => {
          console.log(element)
          map.addLayer({
            id: 'start'+element.long+element.lat,
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: [element.long, element.lat]
                  }
                }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': element.color
            }
          });
        });
        
        
  });
  


}

console.log(getRandomColor)

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getPosition(){
  return new Promise(resolve => {
    $.ajax({
      url: 'http://localhost:3000/api/getPositionColis',
      type: 'GET',
      success: function(data, status){
        resolve(data);
      },
      error: function(data, status){
        console.log("getPosition: "+status);
        return;
      },
      dataType:'json'
    })
  })
}



