const axios = require('axios');
const Directions = require('../models/Directions');
const Traffics = require('../models/Traffics');
require('dotenv/config');

module.exports = {
  postNewTraffic: function(id, res) {
    Directions.findById(
        id
      )
      .exec()
      .then(doc => {
        if (doc) {

          var comprimisedTraffic = {
            "incidents": []
          };

          // Jeden Step einzeln nach Traffic abfragen
          for (i = 0; i < doc.steps.length; i++) {
            var temp = comprimiseTraffic(doc, i, comprimisedTraffic);
            temp.then(function(result) {
              comprimisedTraffic = result;
            }, function(error) {
              res.status(400);
            });

          }
          setTimeout(function() {
            //res.json(comprimisedTraffic);
            const traffic = new Traffics({
              traffic: comprimisedTraffic
            });
            traffic.save(function(error, result) {
              if (result) {
                res.status(200).send(result.id);
              }
              if (error) {
                res.status(502).json({
                  message: "Database-Connection failed",
                  error: error
                });
              }
            });
          }, 500);
        } else {
          res
            .status(404)
            .json({
              message: "No valid entry found for provided ID"
            });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  updateTraffic: function(directionID, trafficID, res) {
    Directions.findById(
        directionID
      )
      .exec()
      .then(doc => {
        if (doc) {

          var comprimisedTraffic = {
            "incidents": []
          };

          // Jeden Step einzeln nach Traffic abfragen
          for (i = 0; i < doc.steps.length; i++) {
            var temp = comprimiseTraffic(doc, i, comprimisedTraffic);
            temp.then(function(result) {
              comprimisedTraffic = result;
            }, function(error) {
              res.status(400);
            });

          }
          setTimeout(function() {
            //res.json(comprimisedTraffic);
            const traffic = {
              traffic: comprimisedTraffic
            };
            Traffics.findOneAndUpdate({
                _id: trafficID
              }, traffic, {
                new: true
              },
              function(error, result) {
                if (result) {
                  res.status(200).send({
                    message: "Successfully updated data",
                    data: doc
                  });
                }
                if (error) {
                  res.status(502).json({
                    message: "Database-Connection failed",
                    error: error
                  });
                }
              });
          }, 500);
        } else {
          res
            .status(404)
            .json({
              message: "No valid entry found for provided ID"
            });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
}

async function comprimiseTraffic(doc, i, comprimisedTraffic) {
  return new Promise(function(resolve, reject) {

    axios.get('https://traffic.api.here.com/traffic/6.0/incidents.json?corridor=' + doc.steps[i].start_location.lat + "," + doc.steps[i].start_location.lng + ';' + doc.steps[i].end_location.lat + "," + doc.steps[i].end_location.lng + ';' + "10" + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
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
              trafficdescription: trafficArray[j].TRAFFICITEMDESCRIPTION[1].content
            };

            if (comprimisedTraffic.incidents.length == 0) {
              comprimisedTraffic.incidents.push(object);
            }

            // Prüfe ob der Incident bereits im Array eingetragen ist
            for (k = 0; k < comprimisedTraffic.incidents.length; k++) {
              if (object.trafficitemid === comprimisedTraffic.incidents[k].trafficitemid) {
                redundant = true;
              }
              if (k == comprimisedTraffic.incidents.length - 1 && !redundant) {
                comprimisedTraffic.incidents.push(object);
              }
            }
          }
        }
        resolve(comprimisedTraffic);
      })
      .catch(error => {
        reject(error);
      });
  });
}
