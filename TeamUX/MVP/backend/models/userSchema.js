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
}, {
  _id: false
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
}, {
  _id: false
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
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});

const userSchema = mongoose.model('users', user);
const mobilitySchema = mongoose.model('mobilities', mobility);
const profileSchema = mongoose.model('profiles', profile);

module.exports = {
  User: userSchema,
  Mobility: mobilitySchema,
  Profile: profileSchema
};