const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  password: {
    // TODO: pw hashing!
    type: String,
    required: true
  },
  profile: {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
  }
})

module.exports = mongoose.model('user', userSchema)