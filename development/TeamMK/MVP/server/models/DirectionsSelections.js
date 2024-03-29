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

const ModesSchema = mongoose.Schema({
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

const SelectionSchema = mongoose.Schema({
	modes:{
		type: Array,
		of: ModesSchema,
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

const DirectionsSelectionSchema = mongoose.Schema({
  selections: {
    type: Array,
    of: SelectionSchema,
    required: true
  }
})

module.exports = mongoose.model('directionsSelection', DirectionsSelectionSchema)
