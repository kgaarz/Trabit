const {
    Report
} = require('../models/reportSchema');
const ApiError = require('./exceptions/apiExceptions');
const admin = require("firebase-admin");
const serviceAccount = require("../notifications/authToken.json");

// initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://frontend-efcfb.firebaseio.com"
});

class Notification {
    async push(reportId) {
        try {
            const report = await Report.getSpecific(reportId);
            const message = {
                topic: report.transport.tag,
                data: {
                    reportId: report._id,
                    transportType: report.transport.type,
                    transportTag: report.transport.tag,
                    destinationCity: report.location.destination.city,
                    reportDescription: report.description
                }
            };
            //push message
            const response = await admin.messaging().send(message);
            console.info('Successfully sent message:', response);
        } catch (error) {
            console.debug('Error sending message:', error);
            throw new ApiError(error, 400);
        }
    }

    async subscribe(registrationToken, topic) {
        try {
            const response = await admin.messaging().subscribeToTopic(registrationToken, topic);
            console.info(`Successfully subscribed ${registrationToken} to topic:`, response);
        } catch (error) {
            console.debug(`Error subscribing ${registrationToken} to topic:`, error);
            throw new ApiError(error, 400);
        }
    }

    async unsubscribe(registrationToken, topic) {
        try {
            const response = await admin.messaging().unsubscribeFromTopic(registrationToken, topic);
            console.info(`Successfully unsubscribed ${registrationToken} from topic:`, response);
        } catch (error) {
            console.debug(`Error unsubscribing ${registrationToken} from topic:`, error);
            throw new ApiError(error, 400);
        }
    }
}

module.exports = Notification;