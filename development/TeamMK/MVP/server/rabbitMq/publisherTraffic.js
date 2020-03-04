const amqp = require('amqplib/callback_api');
const Directions = require('../models/Directions.js');
const Traffics = require('../models/Traffics');
require('dotenv/config');
const axios = require('axios');

//ToDo: jede 5 Minuten traffic in den directions überprüfen
//ToDo: abfrage in die Connection des Servers integrieren
//ToD0: Abfrage welche objects in incidents doppelt sind
//5 Minuten: 300000
module.exports = function(req, res, next) {
  next();
}


var timer = setInterval(function(){getTrafficForDirections();}, 6000);

function getTrafficForDirections(){
getAllRoutes(Directions).then((result) => {

  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      var exchange = 'headers_logs';
      var msg = [];
      var rountingKey = "Warning";
      /*
            var headerOptions = new Map();
                for(i=0; i<result.length; i++){
                  for(n=0; n<result[i].length; n++){
                  headerOptions.set(result[i][n].directionID, result[i][n].step);
                  msg.push(result[i][n].trafficID);
                }
              }
                headerOptions.forEach((value, key) => {
                  let store = {
                    'key': key,
                    'value': value
                  };
                  opts.push({
                    headers: store
                  });
                });
      */
     var opts = [];
      for (i = 0; i < result.length; i++) {
        for (n = 0; n < result[i].length; n++) {
          opts.push({
            headers: {
              'key': JSON.stringify(result[i][n].directionID),
              'value': JSON.stringify(result[i][n].step)
            }
          });
          msg.push(JSON.stringify(result[i][n].trafficID));
        }
      }
      channel.assertExchange(exchange, 'headers', {
        durable: false
      });
      for (i = 0; i < opts.length; i++) {
        channel.publish(exchange, rountingKey, Buffer.from(msg[i]), opts[i]);
        console.log("Sent Header:" + opts[i].headers.key + "; " + opts[i].headers.value + " and Message: " + msg[i]);
      }
    });
    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 10000);
  });
});

}
function getAllRoutes(schema) {
  return new Promise(function(resolve, reject) {
    schema.find({})
      .exec()
      .then(doc => {
        if (doc) {
          postNewTraffic(doc).then(function(result) {
            resolve(result);
          }, (error) => {
            reject(error);
          });
        } else {
          reject(error);
        }
      })
      .catch(err => {
        reject(error);
      });
  });
}

function postNewTraffic(direction) {
  return new Promise(function(resolve, reject) {
    var directionTraffic = [];
    for (x = 0; x < direction.length; x++) {
      directionTraffic.push(getDirectionSteps(direction[x]));
    }
    Promise.all(directionTraffic).then((values) => {

        resolve(values);
      },
      (error) => {
        reject(error);
      });
  });
}


function getDirectionSteps(direction) {
  return new Promise((resolve, reject) => {
    var comprimisedTrafficArray = [];
    for (i = 0; i < 2; i++) {
      comprimisedTrafficArray.push(comprimiseTraffic(direction, i));
    }
    Promise.all(comprimisedTrafficArray).then((values) => {
        /*for (x = 0; x < values[x].length; x++) {
          for (y = 1; x < values[y].length - 1; y++) {
            if (values[x][0].incidents.trafficitemid == values[y][0].incidents.trafficitemid) {
              values.splice(y, 1);
            }
          }
        }*/
        resolve(createTrafficScheme(values));
      },
      (error) => {
        reject(error);
      });
  });
}

function createTrafficScheme(trafficValues) {
  var array = [];
  return new Promise(function(resolve, reject) {
    for (b = 0; b < trafficValues.length; b++) {
      var trafficResult = new Traffics({
        traffic: {
          "incidents": trafficValues[b][0].incidents
        },
      });
      array.push(saveTraffic(trafficResult, trafficValues, b));
    }
    Promise.all(array).then((values) => {
        resolve(values);
      },
      (error) => {
        reject(error);
      });
  });
}

function saveTraffic(trafficResult, trafficValues, b) {
  return new Promise(function(resolve, reject) {
    trafficResult.save(function(error, result) {
      if (result) {
        var tempDirectionId = trafficValues[b][0].directionID;
        var trafficComplete = {
          "trafficID": result.id,
          "directionID": tempDirectionId,
          "step": trafficValues[b][0].step
        };
        resolve(trafficComplete);
      }
      if (error) {
        reject(error);
      }
    });
  });
}

async function comprimiseTraffic(direction, i) {
  var incidents = [];
  return new Promise(function(resolve, reject) {
    axios.get('https://traffic.api.here.com/traffic/6.0/incidents.json?corridor=' + direction.steps[i].start_location.lat + "," + direction.steps[i].start_location.lng + ';' + direction.steps[i].end_location.lat + "," + direction.steps[i].end_location.lng + ';' + "10" + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
      .then(response => {
        // Die Response komprimieren
        if (response.data.TRAFFICITEMS) {
          var trafficArray = response.data.TRAFFICITEMS.TRAFFICITEM;
          var redundant = false;
          for (j = 0; j < trafficArray.length; j++) {
            var object = {
              trafficitemid: trafficArray[j].TRAFFICITEMID,
              geolocation: {
                origin: {
                  lat: trafficArray[j].LOCATION.GEOLOC.ORIGIN.LATITUDE,
                  lng: trafficArray[j].LOCATION.GEOLOC.ORIGIN.LONGITUDE
                },
                destination: {
                  lat: trafficArray[j].LOCATION.GEOLOC.TO[0].LATITUDE,
                  lng: trafficArray[j].LOCATION.GEOLOC.TO[0].LONGITUDE
                }
              },
              trafficdescription: trafficArray[j].TRAFFICITEMDESCRIPTION[1].content,
            };
            if (incidents.length == 0) {
              incidents.push({
                "directionID": direction.id,
                "step": i,
                "incidents": object
              });
            } else {
              for (k = 0; k < incidents.length; k++) {
                if (object.trafficitemid === incidents[k].incidents.trafficitemid) {
                  redundant = true;
                }
                if (k == incidents.length - 1 && !redundant) {
                  incidents.push({
                    "directionID": direction.id,
                    "step": i,
                    "incidents": object
                  });
                }
              }
            }
          }
          resolve(incidents);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
