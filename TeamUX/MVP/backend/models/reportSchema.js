const mongoose = require('mongoose');
const GeodataService = require('../services/geodataService');
const ApiError = require('../exceptions/apiExceptions');

const location = new mongoose.Schema({
  lat: {
    type: String,
    match: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
    required: true
  },
  lng: {
    type: String,
    match: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
    required: true
  },
  city: {
    type: String,
    required: true
  }
}, {
  _id: false
});

const transport = new mongoose.Schema({
  type: {
    type: String,
    enum: ['train', 'subway', 'bus', 'car'],
    required: true
  },
  tag: {
    type: String,
    required: true
  }
}, {
  _id: false
});

const metadata = new mongoose.Schema({
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  _id: false
});

const comment = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  }
});

const report = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    origin: {
      type: Object,
      of: location,
      required: true
    },
    destination: {
      type: Object,
      of: location,
      required: true
    }
  },
  transport: {
    type: Object,
    of: transport,
    required: true
  },
  metadata: {
    type: Object,
    of: metadata,
    required: true,
    default: {}
  },
  comments: [comment]
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});

report.pre('save', async function (next) {
  // overwrite metadata with default values on create
  this.metadata = new metadataSchema();
  // overwrite comment array with empty array on create
  this.comments = [];
  // get origin city from geodata
  this.location.origin.city = await GeodataService.getCityFromGeodata(this.location.origin.lat, this.location.origin.lng);
  // get destination city from geodata
  this.location.destination.city = await GeodataService.getCityFromGeodata(this.location.destination.lat, this.location.destination.lng);
  // get car transport tag from origin geodata
  if (this.transport.type == 'car') {
    this.transport.tag = await GeodataService.getStreetFromGeodata(this.location.origin.lat, this.location.origin.lng);
  }
  // check for duplicate entries
  const reports = await reportSchema.find({
    'location.origin.city': this.location.origin.city,
    'location.destination.city': this.location.destination.city,
    'transport.type': this.transport.type,
    'transport.tag': this.transport.tag
  });
  if (reports.length > 0) {
    throw new ApiError('This incident has already been reported!', 409);
  }
  next();
});

const reportSchema = mongoose.model('report', report);
const locationSchema = mongoose.model('location', location);
const transportSchema = mongoose.model('transport', transport);
const metadataSchema = mongoose.model('metadata', metadata);
const commentSchema = mongoose.model('comment', comment);

module.exports = {
  Report: reportSchema,
  Location: locationSchema,
  Transport: transportSchema,
  Metadata: metadataSchema,
  Comment: commentSchema
};