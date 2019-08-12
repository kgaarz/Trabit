const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.get('/:mobilitiesID', (req, res) => {
    const mobilitiesID=req.params.mobilitiesID
    Routes.findById(
        mobilitiesID
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

router.post('/:userID', (req, res) => {

});

router.put('/:userID/:mobilitiesID', (req, res) => {

});

module.exports = router;
