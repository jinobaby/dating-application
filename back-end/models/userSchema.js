const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    choice: [{ type: String }],
    height: { type: Number },
    location: {
        latitude : {type: Number},
        longitude : {type: Number}
    },
    NotificationsEnabled: { type: Boolean, default: false },
    hobbies: [{ type: String }],
    qualities: [{ type: String }],
    drinking: { type: String },
    smoking: { type: String },
    kids: { type: String },
    family: { type: String },
    religion: { type: String },
    politics: { type: String },
    images: [{ type: String }],
    causes: [{ type: String }],
    likes: { type: [String], default: [] },
    matches: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
})

module.exports = mongoose.model('user-datas', userSchema)