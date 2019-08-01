const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.post('/', (req, res) => {
  var mode = req.body.mode ? req.body.mode : 'driving';

  axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.body.origin + '&destination=' + req.body.destination +
      '&mode=' + mode + '&departure_time=' + req.body.departure_time + '&key=' + process.env.DIRECTIONS_KEY)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/', (req, res) => {
  if (req.query.origin && req.query.destination) {

    var mode = req.query.mode ? req.query.mode : 'driving';
    var now;

    if (!req.query.departure_time) {
      now = new Date().getTime();
    } else {
      console.log(req.query.departure_time);
      console.log(new Date().getTime());
      now = req.query.departure_time > new Date().getTime() ? req.query.departure_time : res.send("Ungültige Abfahrtszeit");
    }

    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.query.origin + '&destination=' + req.query.destination +
        '&mode=' + mode + '&departure_time=' + now + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        console.log(response.data);
        res.send(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    res.send("Gib Start & Ziel ein!");
  }
});

module.exports = router;



//50.941357, 6.958307
//51.023180, 7.562370
