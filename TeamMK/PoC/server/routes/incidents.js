const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

router.get('/', (req, res) => {

  axios.get('https://traffic.api.here.com/traffic/6.0/incidents.json?corridor=' + req.query.origin + ';' + req.query.destination +
  ';' + req.query.width + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
