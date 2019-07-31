const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.get('/', (req, res) => {
  var origin = 'Disneyland';
  var destination = 'Universal+Studios+Hollywood';
  axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&key=' +
      process.env.ROADS_KEY)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/', (req, res) => {
  var mode = req.body.mode ? req.body.mode: 'driving';

  axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.body.origin + '&destination=' + req.body.destination +
  '&mode=' + mode + '&key=' + process.env.ROADS_KEY)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
