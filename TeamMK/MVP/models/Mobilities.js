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

const SurroundingMobilitiesSchema = mongoose.Schema({
	mode: {
		type: String,
		required: true
	},
	geolocation: {
		type: Object,
		of: GeoLocationSchema,
		required: true
	}
})

const MobilitiesSchema = mongoose.Schema({
	surroundingMobilities: {
		type: Array,
		of: SurroundingMobilitiesSchema,
		required: true
	}
})

module.exports = mongoose.model('Mobilities', MobilitiesSchema)
