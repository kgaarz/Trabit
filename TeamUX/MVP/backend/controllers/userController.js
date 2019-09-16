const User = require('../models/userSchema')
const ApiError = require('../exceptions/apiExceptions')

class UserController {
    async create(body) {
        const newUser = new User(body)
        // check if username already exists
        const user = await User.find({
            username: newUser.username
        })
        if (Object.keys(user).length > 0) {
            throw new ApiError('A user with this username already exists!', 409)
        }
        return await new User(newUser).save()
    }

    async getSpecific(userId) {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError('User ID not found!', 404)
        }
        return user
    }

    async getByUsername(username) {
        const user = await User.findOne({
            "username": username
        })
        if (!user) {
            throw new ApiError('Username not found!', 404)
        }
        return user
    }

    async delete(userId) {
        const user = await this.getSpecific(userId)
        return await User.findByIdAndRemove(user._id)
    }

    async updateProfile(userId, body) {
        const user = await this.getSpecific(userId)
        // check if body contains all profile parameters
        const possibleParameters = ['firstname', 'lastname']
        possibleParameters.forEach(param => {
            if (body[param] === undefined) {
                throw new ApiError(`${param} is missing!`, 400)
            }
        })
        return await User.updateOne({
            _id: user._id
        }, {
            profile: body
        })
    }
}

module.exports = new UserController()