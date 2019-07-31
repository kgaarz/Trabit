const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.get('/', (req, res) => {
  
  axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=50.941357&lon=6.958307&radius=10&providernetwork=2', {headers: {'Authorization':process.env.FLINKSTER_KEY}})
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/', (req, res) => {
  
  axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=' + req.body.latitude + '&lon=' + req.body.longitude + '&radius=' + req.body.radius + '&providernetwork=' + req.body.providernetwork, {headers: {'Authorization':process.env.FLINKSTER_KEY}})
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
