const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String},
    middleName: { type: String},
    lastName: { type: String},
    email: { type: String, required: true},
    password: { type: String, required: true},
    location: {
        latitude : {type: Number},
        longitude : {type: Number}
    },
    NotificationsEnabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('user-data', userSchema)