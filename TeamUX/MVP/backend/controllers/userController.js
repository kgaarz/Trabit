const {
    User
} = require('../models/userSchema');
const {
    Profile
} = require('../models/userSchema');
const {
    Mobility
} = require('../models/userSchema');
const {
    RouteAlert
} = require('../models/routeAlertSchema');

const ApiError = require('../exceptions/apiExceptions');

class UserController {
    async create(body) {
        const newUser = new User(body);
        // check if username already exists
        const user = await User.find({
            username: newUser.username
        });
        if (Object.keys(user).length > 0) {
            throw new ApiError('A user with this username already exists!', 409);
        }
        return await new User(newUser).save();
    }

    async getSpecific(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError('User ID not found!', 404);
        }
        return user;
    }

    async getByUsername(username) {
        const user = await User.findOne({
            "username": username
        });
        if (!user) {
            throw new ApiError('Username not found!', 404);
        }
        return user;
    }

    async delete(userId) {
        const user = await this.getSpecific(userId);
        return await User.findByIdAndRemove(user._id);
    }

    async updateProfile(userId, body) {
        const user = await this.getSpecific(userId);
        const newProfile = new Profile(body);
        const validation = newProfile.validateSync();
        if (validation) {
            throw new ApiError(validation.message, 400);
        }
        return await User.updateOne({
            _id: user._id
        }, {
            profile: newProfile
        });
    }

    async updateMobility(userId, body) {
        const user = await this.getSpecific(userId);
        // check if body contains all mobility parameters
        const newMobility = new Mobility(body);
        const validation = newMobility.validateSync();
        if (validation) {
            throw new ApiError(validation.message, 400);
        }
        return await User.updateOne({
            _id: user._id
        }, {
            mobility: newMobility
        });
    }

    async getRouteAlerts(userId) {
        const user = await this.getSpecific(userId);
        const routes = await RouteAlert.find({
            user: user._id
        });
        return routes;
    }
}

module.exports = new UserController();