const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//Settings festlegen
const settings = {
  port: process.env.PORT || 3000,
};

//Routes importiert
const mobilitiesRoute = require('./routes/mobilities');
const alternativeDirectionsRoute = require('./routes/alternativeDirections');
const directionsSelectionsRoute = require('./routes/directionsSelections');
const directionsRoute = require('./routes/directions');
const trafficsRoute = require('./routes/traffics');

app.use('/mobilities', mobilitiesRoute);
app.use('/alternativeDirections', alternativeDirectionsRoute);
app.use('/directionsSelections', directionsSelectionsRoute);
app.use('/directions', directionsRoute);
app.use('/traffics', trafficsRoute);

app.get('/', (req, res) => {
  res.send('Trabit-Server ist online!');
});

//Verbindung zur DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true
}, () => {
  mongoose.connection.readyState == 1 ? console.log("DB connected") : console.log("DB disconnected");
});

app.listen(settings.port, function() {
  console.log("Server ist auf Port " + settings.port + " gestartet.");
});
