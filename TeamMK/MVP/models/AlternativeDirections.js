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

const RouteSchema = mongoose.Schema({
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

const AvailableMobilityOptionsSchema = mongoose.Schema({
  car: {
    type: Boolean,
    required: true
  },
  eCar: {
    type: Boolean,
    required: true
  },
  bike: {
    type: Boolean,
    required: true
  },
  longboard: {
    type: Boolean,
    required: true
  },
  motorScooter: {
    type: Boolean,
    required: true
  },
  eMotorScooter: {
    type: Boolean,
    required: true
  },
  eScooter: {
    type: Boolean,
    required: true
  },
  trainTicket: {
    type: Boolean,
    required: true
  }
})

const AlternativeDirectionsSchema = mongoose.Schema({
  modes: {
    type: Array,
    of: AvailableMobilityOptionsSchema,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  switches: {
    type: Number,
    required: true
  },
  sustainability: {
    type: Number,
    required: true
  },
  route: {
    type: Object,
    of: RouteSchema,
    required: true
  }
})

module.exports = mongoose.model('AlternativeDirections', AlternativeDirectionsSchema)
