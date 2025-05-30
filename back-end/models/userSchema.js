const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    choice: [{ type: String }],
    height: { type: Number },
    email: { type: String, required: true},
    password: { type: String, required: true},
    location: {
        latitude : {type: Number},
        longitude : {type: Number}
    },
    NotificationsEnabled: { type: Boolean, default: false },
    hobbies: [{ type: String }]
})

module.exports = mongoose.model('user-data', userSchema)