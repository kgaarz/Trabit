const {
    Transport
} = require('../models/reportSchema');
const {
    Location
} = require('../models/reportSchema');
const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


const duration = new mongoose.Schema({
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
}, {
    _id: false
});

const routeAlert = new mongoose.Schema({
    user: {
        type: ObjectId,
        required: true,
    },
    location: {
        origin: {
            type: Object,
            of: Location,
            required: true
        },
        destination: {
            type: Object,
            of: Location,
            required: true
        }
    },
    transport: {
        type: Object,
        of: Transport,
        required: true
    },
    duration: {
        type: Object,
        of: duration,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'modified'
    }
});

const routeAlertSchema = mongoose.model('routeAlert', routeAlert);
const durationSchema = mongoose.model('duration', duration);

module.exports = {
    RouteAlert: routeAlertSchema,
    Duration: durationSchema,
};