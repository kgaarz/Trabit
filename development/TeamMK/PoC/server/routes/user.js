const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
require('dotenv/config');

router.get('/', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    currentLocation: {
      lat: req.body.currentLocation.lat,
      lng: req.body.currentLocation.lng
    },
    availableMobilityOptions: {
      car: req.body.availableMobilityOptions.car,
      e_car: req.body.availableMobilityOptions.e_car,
      bike: req.body.availableMobilityOptions.bike,
      longboard: req.body.availableMobilityOptions.longboard,
      motorScooter: req.body.availableMobilityOptions.motorScooter,
      e_motorScooter: req.body.availableMobilityOptions.e_motorScooter,
      e_scooter: req.body.availableMobilityOptions.e_scooter,
      trainTicket: req.body.availableMobilityOptions.trainTicket,
    }
  });

  try {
    const savedPost = await user.save();
    res.json(savedPost);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
