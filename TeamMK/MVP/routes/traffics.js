const express = require('express');
const axios = require('axios');
const router = express.Router();
const Traffics = require('../models/Traffics');
const Directions = require('../models/Directions');
require('dotenv/config');
const getRoute = require('../logic/getRoutes');
const deleteRoute = require('../logic/deleteRoutes');
const comprimiseTraffic = require('../logic/comprimiseTraffic');

router.get('/:trafficID', (req, res) => {
  getRoute(req.params.trafficID, Traffics, res);
});

router.post('/:directionID', (req, res) => {
  const id = req.params.directionID;
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
});

router.put('/:directionID/:trafficID', (req, res) => {

});

router.delete('/:trafficID', (req, res) => {
  deleteRoute(req.params.trafficID, Traffics, res);
});

module.exports = router;
