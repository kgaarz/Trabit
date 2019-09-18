const {
    RouteAlert
} = require('../models/routeAlertSchema');
const UserController = require('./userController');
const ApiError = require('../exceptions/apiExceptions');

class RouteAlertController {
    async create(body) {
        // check if user exists
        await UserController.getSpecific(body.user);
        const newRouteAlert = new RouteAlert(body);
        // check if route alert already exists
        const routeAlert = await RouteAlert.find({
            user: newRouteAlert.user,
            'location.origin.lat': newRouteAlert.location.origin.lat,
            'location.origin.lng': newRouteAlert.location.origin.lng,
            'location.destination.lat': newRouteAlert.location.destination.lat,
            'location.destination.lng': newRouteAlert.location.destination.lng,
            'transport.type': newRouteAlert.transport.type,
            'transport.tag': newRouteAlert.transport.tag,
            'duration.from': newRouteAlert.duration.from,
            'duration.to': newRouteAlert.duration.to
        });
        if (Object.keys(routeAlert).length > 0) {
            throw new ApiError('This route alert has already been saved (duplicate entry)!', 409);
        }
        return await new RouteAlert(newRouteAlert).save();
    }

    async getSpecific(routeAlertId) {
        const routeAlert = await RouteAlert.findById(routeAlertId);
        if (!routeAlert) {
            throw new ApiError('RouteAlert ID not found!', 404);
        }
        return routeAlert;
    }

    async getAll() {
        return RouteAlert.find();
    }

    async delete(routeAlertId) {
        const routeAlert = await this.getSpecific(routeAlertId);
        return await RouteAlert.findByIdAndRemove(routeAlert._id);
    }
}

module.exports = new RouteAlertController();