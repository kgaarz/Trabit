const mongoose = require('mongoose');

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
  start_location: [Number],
  end_location: [Number],
  steps: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Directions', DirectionsSchema)
