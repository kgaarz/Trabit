const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.get('/:directionID', (req, res) => {
    const directionID=req.params.directionID
    Routes.findById(
        directionID
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

router.post('/:userID/:directionSelectionID', (req, res) => {

});

router.put('/:directionID/:alternativeDirectionID', (req, res) => {

});

router.delete('/:directionID', (req, res) => {

});

module.exports = router;
