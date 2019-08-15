var users = require('./sample_data/users.json')
var reports = require('./sample_data/reports.json')

const connectionString = 'mongodb+srv://trabit_app:xXqOmWxit7hQModx@trabitcluster-cjkny.mongodb.net/trabit?retryWrites=true&w=majority'
const mongoose = require('mongoose')

// user schema & model
const userSchema = require('./userSchema.js')
const User = mongoose.model('user', userSchema, 'users')

// report schema & model
const reportSchema = require('./reportSchema.js')
const Report = mongoose.model('report', reportSchema, 'reports')

;
(async () => {
    const connector = await mongoose.connect(connectionString, {
        useNewUrlParser: true
    })

    // create sample users
    for (const user of users) {
        await new User(user).save()
    };

    // create sample reports
    for (const report of reports) {
        await new Report(report).save()
    };

    process.exit(0)
})()