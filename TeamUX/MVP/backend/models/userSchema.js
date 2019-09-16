const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    match: /^[A-Za-z0-9]+[-_]*[A-Za-z0-9]+$/,
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
  modified: {
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
});

userSchema.post('update', function () {
  this.update({}, {
    $set: {
      modified: new Date()
    }
  });
});

userSchema.post('save', function () {
  this.update({}, {
    $set: {
      modified: new Date()
    }
  });
});

module.exports = mongoose.model('user', userSchema);