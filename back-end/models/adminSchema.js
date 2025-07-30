var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true }
});

module.exports = mongoose.model('Admin-data', adminSchema);