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

const DirectionsSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  startLocation: {
    type: Object,
    of: GeoLocationSchema,
    required: true
  },
  endLocation: {
    type: Object,
    of: GeoLocationSchema,
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Directions', DirectionsSchema)
