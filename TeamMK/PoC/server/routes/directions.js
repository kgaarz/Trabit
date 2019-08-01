const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');


router.get('/', (req, res) => {
  if (req.query.origin && req.query.destination) {

    var mode = req.query.mode ? req.query.mode : 'driving';
    
    var depature_time = checkDepartureTime(req.query.departure_time, res);
	  
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.query.origin + '&destination=' + req.query.destination +
        '&mode=' + mode + '&departure_time=' + depature_time + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
		res.send(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    res.status(400).send("Gib Start & Ziel ein!");
  }
});


router.get('/traffic', (req, res) => {
  if (req.query.origin && req.query.destination) {

    var mode = req.query.mode ? req.query.mode : 'driving';
    
    var depature_time = checkDepartureTime(req.query.departure_time, res);
	  
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.query.origin + '&destination=' + req.query.destination +
        '&mode=' + mode + '&departure_time=' + depature_time + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
		var traffic = checkTraffic(response);
		res.send("Traffic: " + traffic + " min");
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    res.status(400).send("Gib Start & Ziel ein!");
  }
});


function checkDepartureTime(departure_time, res){
	if (!departure_time) {
      var now = new Date().getTime();
    } else {
      var now = new Date(departure_time*1000).valueOf() > new Date().getTime() ? departure_time : res.send("Ungültige Abfahrtszeit");
    }   
	return now;
}

function checkTraffic(json){
	var time = json.data.routes[0].legs[0].duration_in_traffic.value - json.data.routes[0].legs[0].duration.value;
	
	var hr = ~~(time / 3600);
    var min = ~~((time % 3600) / 60);
    var sec = time % 60;
    var sec_min = "";
    if (hr > 0) {
         sec_min += "" + hrs + ":" + (min < 10 ? "0" : "");
    }
    sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
    sec_min += "" + sec;
    return sec_min;
}

module.exports = router;