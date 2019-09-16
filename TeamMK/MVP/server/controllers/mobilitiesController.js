const User = require('../models/User');
const Mobilities = require('../models/Mobilities');
const apiRequestHelper = require('./helpers/apiRequestHelper');

module.exports = {
  postNewMobilities: function(schema, userID, req, res) {
    User.findById(
        userID
      )
      .exec()
      .then(doc => {
        if (doc) {
          var flinksterData, cabData, hereData;
          var availableMobility = doc.availableMobilityOptions;


          if (availableMobility.sharing) {

            if (availableMobility.trainTicket) {
              if (availableMobility.driverLicence) {
                flinksterData = apiRequestHelper.getFlinksterData(req.body.lat, req.body.lng, req.body.radius);
                cabData = apiRequestHelper.getCabData(req.body.lat, req.body.lng, req.body.radius);
                hereData = apiRequestHelper.getHereData(req.body.lat, req.body.lng, req.body.radius);
              } else {
                cabData = apiRequestHelper.getCabData(req.body.lat, req.body.lng, req.body.radius);
                hereData = apiRequestHelper.getHereData(req.body.lat, req.body.lng, req.body.radius);
              }
            } else {
              flinksterData = apiRequestHelper.getFlinksterData(req.body.lat, req.body.lng, req.body.radius);
              cabData = apiRequestHelper.getCabData(req.body.lat, req.body.lng, req.body.radius);
            }
            if (!availableMobility.driverLicence) {
              cabData = apiRequestHelper.getCabData(req.body.lat, req.body.lng, req.body.radius);
              hereData = apiRequestHelper.getHereData(req.body.lat, req.body.lng, req.body.radius);
            }
          } else if (availableMobility.trainTicket) {
            hereData = apiRequestHelper.getHereData(req.body.lat, req.body.lng, req.body.radius);
          }


          Promise.all([flinksterData, cabData, hereData]).then(values => {
            var currentLocation = {
              lat: req.body.lat,
              lng: req.body.lng
            };
            var mobilities = new Mobilities({
              currentLocation: currentLocation,
              cars: values[0],
              bikes: values[1],
              transits: values[2]
            });

            mobilities.save(function(error, result) {
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
          }).catch(error => {
            res.status(404).send(error);
          });

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

  updateMobilities: function(userID, mobilitiesID, req, res) {
    User.findById(
        userID
      )
      .exec()
      .then(doc => {
        if (doc) {
          var flinksterData = [];
          var cabData = [];
          var hereData = [];
          var availableMobility = doc.availableMobilityOptions;


          if (availableMobility.sharing) {

            if (availableMobility.trainTicket) {
              if (availableMobility.driverLicence) {
                flinksterData = getFlinksterData(req);
                cabData = getCabData(req);
                hereData = getHereData(req);
              } else {
                cabData = getCabData(req);
                hereData = getHereData(req);
              }
            } else {
              flinksterData = getFlinksterData(req);
              cabData = getCabData(req);
            }
            if (!availableMobility.driverLicence) {
              cabData = getCabData(req);
              hereData = getHereData(req);
            }
          } else if (availableMobility.trainTicket) {
            hereData = getHereData(req);
          }


          Promise.all([flinksterData, cabData, hereData]).then(values => {
            var currentLocation = {
              lat: req.body.lat,
              lng: req.body.lng
            };
            var mobilities = {
              currentLocation: currentLocation,
              cars: values[0],
              bikes: values[1],
              transits: values[2]
            };

            Mobilities.findOneAndUpdate({
              _id: mobilitiesID
            }, mobilities, {
              new: true
            }, function(error, result) {
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
          }).catch(error => {
            res.status(404).send(error);
          });

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
  }
}
