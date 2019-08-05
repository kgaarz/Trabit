const express = require('express');
const router = express.Router();
const Routes = require('../models/Routes');
const axios = require('axios');
require('dotenv/config');

router.get('/', async (req, res) => {
    try {
        const routes = await Routes.find();
        res.json(routes);
    } catch (error) {
    	res.json({ message:error });
  	}
});

router.post('/', async (req, res) => {
	var jsonData;
	
	if (req.query.origin && req.query.destination) {
		var mode = req.query.mode ? req.query.mode : 'driving';
    	var depature_time = checkDepartureTime(req.query.departure_time, res);
	  
    	axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.query.origin + '&destination=' + req.query.destination + '&mode=' + mode + '&departure_time=' + depature_time + '&key=' + process.env.DIRECTIONS_KEY)
      	.then(response => {
			jsonData = response.data.routes[0].legs[0];
			var comprimisedSteps = comprimiseSteps(jsonData.steps);
			
			const newRoute = new Routes({
				user_id: "eins1",
        		distance: jsonData.distance.value,
	    		duration: jsonData.duration.value,
				start_location: [jsonData.start_location.lng, jsonData.start_location.lat],
				end_location: [jsonData.end_location.lng, jsonData.end_location.lat],
				steps: comprimisedSteps
    		});
			const savedRoutes = newRoute.save();
    		res.status(200).send("Die Route wurde vermutlich gespeichert");
			
		}).catch(error => {
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

function comprimiseSteps(data){
	var steps = [];
	for(var i=0; i<data.length; i++) {
		var object = {start_location: data[i].start_location, end_location: data[i].end_location};
		steps[i] = object;
	}
	return steps;
}

module.exports = router;