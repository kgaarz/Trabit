const axios = require('axios');
require('dotenv/config');
const User = require('../models/User');

module.exports = {
  postNewMobilities: function(schema, userID, req, res) {
    User.findById(
        userID
      )
      .exec()
      .then(doc => {
        if (doc) {
          if (doc.availableMobilityOptions.car) {
            var flinksterData = getFlinksterData(req);
            var cabData = getCabData(req);

            Promise.all([flinksterData, cabData]).then(values => {
              res.send(values);
            }).catch(error => {
              res.status(404).send(error);
            });
          }
        } else {
          res
            .status(404)
            .json({
              message: "No valid entry found for provided ID"
            });
        }
      })
      .catch(err => {
        res.status(502).json({
          message: "Database-Connection failed",
          error: err
        });
      });
  },

  updateMobilities: function(userID, mobilitiesID, res) {
    //TODO: Funktion muss noch eingebaut werden
  }
}

function getFlinksterData(req) {
  return new Promise(function(resolve, reject) {
    var flinksterItems = [];
    const providernetwork = "1";
    const mode = "car";

    axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=' + req.body.lat + '&lon=' + req.body.lng + '&radius=' + req.body.radius + '&providernetwork=' + providernetwork, {
        headers: {
          'Authorization': process.env.FLINKSTER_KEY
        }
      })
      .then(response => {
        for (i = 0; i < response.data.items.length; i++) {
          var object = {
            itemID: response.data.items[i].uid,
            geoLocation: {
              lat: response.data.items[i].geometry.position.coordinates[1],
              lng: response.data.items[i].geometry.position.coordinates[0],
            },
            description: {
              parking: response.data.items[i].attributes.parking,
              locationNote: response.data.items[i].attributes.locationnote
            },
            mode: mode
          }
          flinksterItems.push(object);
        }
        resolve(flinksterItems);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getCabData(req) {
  return new Promise(function(resolve, reject) {
    var cabItems = [];
    const providernetwork = "2";
    const mode = "bike";

    axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=' + req.body.lat + '&lon=' + req.body.lng + '&radius=' + req.body.radius + '&providernetwork=' + providernetwork, {
        headers: {
          'Authorization': process.env.FLINKSTER_KEY
        }
      })
      .then(response => {
        for (i = 0; i < response.data.items.length; i++) {
          var geoLocation;
          if (response.data.items[i].geometry.position.type === "Point") {
            var object = {
              itemID: response.data.items[i].uid,
              geoLocation: {
                lat: response.data.items[i].geometry.position.coordinates[1],
                lng: response.data.items[i].geometry.position.coordinates[0],
              },
              mode: mode
            }
            cabItems.push(object);
          }
        }
        resolve(cabItems);
      })
      .catch(error => {
        reject(error);
      });
  });
}
