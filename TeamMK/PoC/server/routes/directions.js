const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.post('/', (req, res) => {
  var mode = req.body.mode ? req.body.mode: 'driving';

  axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.body.origin + '&destination=' + req.body.destination +
  '&mode=' + mode + '&key=' + process.env.DIRECTIONS_KEY)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
