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
  user_id: {
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
  start_location: {
    type: Object,
    of: GeoLocationSchema,
    required: true
  },
  end_location: {
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
