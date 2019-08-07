const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//import routes
const postsRoute = require('./routes/posts');
const directionsRoute = require('./routes/directions');
const flinksterRoute = require('./routes/flinkster');
const incidentsRoute = require('./routes/incidents');
const routesRoute = require('./routes/routes');
const userRoute = require('./routes/user');

app.use('/posts', postsRoute);
app.use('/directions', directionsRoute);
app.use('/flinkster', flinksterRoute);
app.use('/incidents', incidentsRoute);
app.use('/routes', routesRoute);
app.use('/user', userRoute);

//routes
app.get('/', (req, res) => {
  res.send('We are on home');
});

//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  mongoose.connection.readyState == 1 ? console.log("DB connected"): console.log("DB disconnected");
});

app.listen(3000);
