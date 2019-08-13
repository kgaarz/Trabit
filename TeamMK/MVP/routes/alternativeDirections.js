const express = require('express');
const axios = require('axios');
const router = express.Router();
const AlternativeDirections = require('../models/AlternativeDirections');
require('dotenv/config');

router.get('/:alternativeDirectionID', (req, res) => {
    const alternativeDirectionID=req.params.alternativeDirectionID
    AlternativeDirections.findById(
        alternativeDirectionID
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

router.post('/:userID/:trafficID', (req, res) => {

});

router.delete('/:alternativeDirectionID', (req, res) => {

});

module.exports = router;
