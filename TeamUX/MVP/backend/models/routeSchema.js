const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    transport: {
        transportType: {
            type: String,
            enum: ['train', 'subway', 'bus', 'car'],
            required: true
        },
        transportTag: {
            type: String,
            required: true
        },
        transportDirection: {
            type: String,
            required: true
        }
    }
    // NOT IN MVP - FUTURE ADDON
    // schedule: {
    //     from: {
    //         type: Date,
    //         default: Date.now,
    //         required: true
    //     },
    //     to: {
    //         type: Date,
    //         default: Date.now,
    //         required: true
    //     }
    // }
});

module.exports = mongoose.model('route', routeSchema);