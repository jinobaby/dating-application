const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postBio: { type: String, required: true },
    postImage: { type: String, required: true },
    userId: { type: String, required: true }
})

module.exports = mongoose.model('Post', postSchema)