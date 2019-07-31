const express = require('express');
const axios = require('axios');
require('dotenv/config');

const router = express.Router();

router.get('/', (req, res) => {

axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyCZVkrJkiRNaIS3f60yWWKRNjdfGbdGayI')
  .then(response => {
    console.log(response.data);
	res.send(response.data);
  })
  .catch(error => {
    console.log(error);
  });
});



module.exports = router;
