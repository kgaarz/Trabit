const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Agenda = require('agenda');
const usersRoute = require('./routes/users');
const reportsRoute = require('./routes/reports');
const commentsRoute = require('./routes/comments');
const ReportController = require('./controllers/reportController');
const ApiError = require('./exceptions/apiExceptions');
require('dotenv').config();

(async () => {
    // connect to db
    const db = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    app.use(bodyParser.json());
    app.use(usersRoute);
    app.use(reportsRoute);
    app.use(commentsRoute);

    // handler for 405 - Method not allowed
    app.use((req, res) => {
        const error = new ApiError('This method is not defined in this API!', 405);
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    });

    // handler for 500 - Internal Server Error
    app.use((err, req, res) => {
        const error = new ApiError('Something has gone wrong on the server... Please contact the Trabit team for support!', 500);
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.debug(`ReportAPI server running on port ${PORT}.`));

    // agenda jobs
    const jobs = new Agenda().mongo(db.connection, 'jobs');

    // defining jobs for regular report checks
    jobs.define('checkReportVerificationState', async () => {
        const reports = await ReportController.getFiltered({
            active: true
        });
        reports.forEach(async (report) => {
            return await ReportController.updateVerificationState(report._id);
        });
    });

    jobs.define('checkReportActiveState', async () => {
        const reports = await ReportController.getFiltered({
            active: true
        });
        reports.forEach(async (report) => {
            return await ReportController.updateActiveState(report._id);
        });
    });

    // run jobs
    await jobs.start();
    await jobs.every(`*/${process.env.JOB_REPEAT_EVERY} * * * *`, 'checkReportVerificationState');
    await jobs.every(`*/${process.env.JOB_REPEAT_EVERY} * * * *`, 'checkReportActiveState');
})();