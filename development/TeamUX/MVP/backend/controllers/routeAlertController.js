const {
    RouteAlert
} = require('../models/routeAlertSchema');
const UserController = require('./userController');
const ApiError = require('../exceptions/apiExceptions');
// const RouteAlertNotification = require('../notifications/routeAlertNotification');

class RouteAlertController {
    async create(body /*, registrationToken*/ ) {
        // check if user exists
        await UserController.getSpecific(body.user);
        const routeAlert = new RouteAlert(body);
        // RouteAlertNotification.subscribe(registrationToken, routeAlert.transport.tag);
        // TODO: create job to unsubscribe from topic after routeAlert duration
        return await routeAlert.save();
    }

    async getSpecific(routeAlertId) {
        const routeAlert = await RouteAlert.findById(routeAlertId);
        if (!routeAlert) {
            throw new ApiError('RouteAlert ID not found!', 404);
        }
        return routeAlert;
    }

    async getByDirections(directionsId) {
        const routeAlert = await RouteAlert.find({
            directions: directionsId
        });
        if (!routeAlert) {
            throw new ApiError('No RouteAlerts with given directionsId found!', 404);
        }
        return routeAlert;
    }

    async getAll() {
        return RouteAlert.find();
    }

    async delete(routeAlertId /*, registrationToken*/ ) {
        const routeAlert = await this.getSpecific(routeAlertId);
        // const topic = routeAlert.transport.tag;
        return await RouteAlert.findByIdAndRemove(routeAlert._id);
        // RouteAlertNotification.unsubscribe(registrationToken, topic);
    }
}

module.exports = new RouteAlertController();