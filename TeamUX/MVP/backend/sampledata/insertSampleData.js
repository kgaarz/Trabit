const {
    User
} = require('../models/userSchema');
const {
    Report
} = require('../models/reportSchema');
const users = require('./users.json');
const reports = require('./reports.json');
const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    // create sample users
    for (const user of users) {
        await new User(user).save();
    }

    // create sample reports
    for (const report of reports) {
        await new Report(report).save();
    }

    process.exit(0);
})();