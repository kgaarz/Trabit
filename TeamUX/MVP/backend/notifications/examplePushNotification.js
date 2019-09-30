var admin = require("firebase-admin");
var serviceAccount = require("./authToken.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://frontend-efcfb.firebaseio.com"
});

// define message
var message = {
    topic: 'RB25',
    data: {
        reportId: '5d910e52c5a2ac1708af7e4b',
        transportType: 'train',
        transportTag: 'RB25',
        reportDescription: 'Zug fällt aus... schon wieder!'
    }
};

// send message to devices subscribed to the provided topic
(async () => {
    try {
        const response = await admin.messaging().send(message);
        console.info('Successfully sent message:', response);
    } catch (error) {
        console.debug('Error sending message:', error);
    } finally {
        process.exit(0);
    }
})();