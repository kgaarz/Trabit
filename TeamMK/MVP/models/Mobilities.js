const mongoose = require('mongoose');

const MobilitiesSchema = mongoose.Schema({
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
