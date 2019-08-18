let express = require('express')
let app = express()
let usersRoute = require('./routes/users')
let reportsRoute = require('./routes/reports')
let commentsRoute = require('./routes/comments')
let bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ApiError = require('./exceptions/apiExceptions')
require('dotenv').config()

// connect to db
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.use(bodyParser.json())
app.use(usersRoute)
app.use(reportsRoute)
app.use(commentsRoute)

// handler for 405 - Method not allowed
app.use((req, res) => {
    const error = new ApiError('This method is not defined in this API!', 405)
    res.status(error.statusCode ? error.statusCode : 500).json(error.message)
})

// handler for 500 - Internal Server Error
app.use((err, req, res) => {
    console.error(err.stack)
    const error = new ApiError('Something has gone wrong on the server... Please contact the TrabitReport team for support!', 500)
    res.status(error.statusCode ? error.statusCode : 500).json(error.message)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`TrabitReport server running on port ${PORT}.`))