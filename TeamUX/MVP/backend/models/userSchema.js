const mongoose = require('mongoose');

const profile = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
});

const mobility = new mongoose.Schema({
  car: {
    type: Boolean,
    required: true
  },
  driversLicense: {
    type: Boolean,
    required: true
  },
  bike: {
    type: Boolean,
    required: true
  },
  trainTicket: {
    type: Boolean,
    required: true
  },
  sharing: {
    type: Boolean,
    required: true
  }
});

const user = new mongoose.Schema({
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
    type: Object,
    of: profile,
    required: true
  },
  mobility: {
    type: Object,
    of: mobility,
    required: true
  }
});

user.post('update', function () {
  this.update({}, {
    $set: {
      modified: new Date()
    }
  });
});

user.post('save', function () {
  this.update({}, {
    $set: {
      modified: new Date()
    }
  });
});

const userSchema = mongoose.model('users', user);
const mobilitySchema = mongoose.model('mobilities', mobility);
const profileSchema = mongoose.model('profiles', profile);

module.exports = {
  User: userSchema,
  Mobility: mobilitySchema,
  Profile: profileSchema
};