const mongoose = require('mongoose');

const currentLocationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
});

const availableMobilityOptionsSchema = new mongoose.Schema({
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
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  currentLocation: {
    type: Object, of: currentLocationSchema, required: true
  },
  availableMobilityOptions: {
    type: Object, of: availableMobilityOptionsSchema, required: true
  }
})

module.exports = mongoose.model('User', UserSchema)
