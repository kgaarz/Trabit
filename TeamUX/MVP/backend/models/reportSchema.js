const mongoose = require('mongoose')
const commentSchema = require('./commentSchema.js')

const reportSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  location: {
    lat: {
      type: String,
      required: true
    },
    long: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  transport: {
    transportType: {
      type: String,
      required: true
    },
    transportTag: {
      type: String,
      required: true // also required for car reports?
    },
    transportDirection: {
      type: String,
      required: true
    }
  },
  description: {
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
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  comments: [commentSchema]
})

module.exports = mongoose.model('report', reportSchema)