const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // constraints hinzufügen, um z.B. Leerzeichen zu vermeiden
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
    //   noch nicht gehashed! TODO!!
    type: String,
    required: true
  },
  profile: { // evtl. ersetzen durch profile? dann könnte man ein eigenes schema für profile machen und darin alle relevanten daten einpflegen
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