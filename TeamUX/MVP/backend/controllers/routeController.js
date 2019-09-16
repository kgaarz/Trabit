const Route = require('../models/routeSchema');
const UserController = require('./userController');
const ApiError = require('../exceptions/apiExceptions');

class RouteController {
    constructor() {
        // route model with allowed insert params
        this.createRouteModel = {
            owner: undefined,
            city: undefined,
            transport: {
                transportType: undefined,
                transportTag: undefined,
                transportDirection: undefined,
            }
        };
    }

    async create(body) {
        // check if owner exists
        await UserController.getByUsername(body.owner);

        const newRoute = {};
        Object.keys(this.createRouteModel).forEach(key => newRoute[key] = body[key]);

        // check if route already exists
        const route = await Route.find(newRoute);
        if (Object.keys(route).length > 0) {
            throw new ApiError('This route has already been saved for this user!', 409);
        }
        return await new Route(newRoute).save();
    }

    async getSpecific(routeId) {
        const route = await Route.findById(routeId);
        if (!route) {
            throw new ApiError('Route ID not found!', 404);
        }
        return route;
    }

    async delete(routeId) {
        const route = await this.getSpecific(routeId);
        return await Route.findByIdAndRemove(route._id);
    }
}

module.exports = new RouteController();