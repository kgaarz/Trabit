const mongoose = require('mongoose');

const TrafficsSchema = mongoose.Schema({
    traffic: {
		type: Array, 
		of: IncidentsSchema, 
		required: true
	}
})

const IncidentsSchema = mongoose.Schema({
	trafficitemid: {
		type: Number,
    	required: true
	},
	geolocation: {
		type: Object, 
		of: GeoLocationSchema, 
		required: true
	},
	trafficdescription: {
		type: String,
		required: true
	}
})

const GeoLocationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Traffics', TrafficsSchema)
