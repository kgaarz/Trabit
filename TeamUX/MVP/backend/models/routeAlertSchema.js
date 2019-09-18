const {
    Transport
} = require('../models/reportSchema');
const {
    Location
} = require('../models/reportSchema');
const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const GeodataService = require('../services/geodataService');
const ApiError = require('../exceptions/apiExceptions');

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

routeAlert.pre('save', async function (next) {
    // get origin city from geodata
    this.location.origin.city = await GeodataService.getCityFromGeodata(this.location.origin.lat, this.location.origin.lng);
    // get destination city from geodata
    this.location.destination.city = await GeodataService.getCityFromGeodata(this.location.destination.lat, this.location.destination.lng);
    // get car transport tag from origin geodata
    if (this.transport.type == 'car') {
        this.transport.tag = await GeodataService.getStreetFromGeodata(this.location.origin.lat, this.location.origin.lng);
    }
    // check for duplicate entries
    const routeAlerts = await routeAlertSchema.find({
        user: this.user,
        'location.origin.lat': this.location.origin.lat,
        'location.origin.lng': this.location.origin.lng,
        'location.destination.lat': this.location.destination.lat,
        'location.destination.lng': this.location.destination.lng,
        'transport.type': this.transport.type,
        'transport.tag': this.transport.tag,
        'duration.from': this.duration.from,
        'duration.to': this.duration.to
    });
    if (routeAlerts.length > 0) {
        throw new ApiError('This route alert has already been saved (duplicate entry)!', 409);
    }
    next();
});

const routeAlertSchema = mongoose.model('routeAlert', routeAlert);
const durationSchema = mongoose.model('duration', duration);

module.exports = {
    RouteAlert: routeAlertSchema,
    Duration: durationSchema,
};