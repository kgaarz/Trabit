const mongoose = require('mongoose');

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

const MobilitiesSchema = mongoose.Schema({
	currentLocation: {
		type: Object,
		of: GeoLocationSchema,
		required: true
	},
	cars: {
		type: Array,
		required: true
	},
	bikes: {
		type: Array,
		required: true
	},
	transits: {
		type: Array,
		required: true
	}
})

module.exports = mongoose.model('Mobilities', MobilitiesSchema)
