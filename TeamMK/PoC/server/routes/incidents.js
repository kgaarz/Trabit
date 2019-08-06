const express = require('express');
const axios = require('axios');
const router = express.Router();
const Routes = require('../models/Routes');
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


// Traffic auf den Routen einer bestimmten User-ID anfragen
router.get('/trafficById/:user_id', (req, res) => {
	const id = req.params.user_id;
    console.log("user_id: " + id);
    Routes.findOne({
		user_id: id
	})
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc.start_location[0] + ", " + doc.start_location[1]);
                console.log(doc.end_location[0] + ", " + doc.end_location[1]);
				
				axios.get('https://traffic.api.here.com/traffic/6.0/incidents.json?corridor=' + doc.start_location[1] + "," + doc.start_location[0] + ';' + doc.end_location[1] + "," + doc.end_location[0] + ';' + "50" + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
					.then(response => {
      					console.log("Traffic: " + response.data);
      					res.status(200).json(response.data);
					})
					.catch(error => {
						console.log(error);
    				});
            } else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
