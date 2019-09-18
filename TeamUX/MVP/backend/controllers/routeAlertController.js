const {
    RouteAlert
} = require('../models/routeAlertSchema');
const UserController = require('./userController');
const ApiError = require('../exceptions/apiExceptions');

class RouteAlertController {
    async create(body) {
        // check if user exists
        await UserController.getSpecific(body.user);
        return await new RouteAlert(body).save();
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