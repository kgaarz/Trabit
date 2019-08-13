const express = require('express');
const axios = require('axios');
const router = express.Router();
const Traffics = require('../models/Traffics');
require('dotenv/config');

router.get('/:trafficID', (req, res) => {
    const trafficID=req.params.trafficID
    Traffics.findById(
        trafficID
      )
      .exec()
      .then(doc => {
        if (doc) {

            res.status(200).send(doc);
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
});

router.post('/:directionID', (req, res) => {

});

router.put('/:directionID/:trafficID', (req, res) => {

});

router.delete('/trafficID', (req, res) => {

});

module.exports = router;
