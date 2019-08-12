const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//import routes
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

//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  mongoose.connection.readyState == 1 ? console.log("DB connected"): console.log("DB disconnected");
});

app.listen(3000);
