const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensures unique usernames
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Logindata', loginSchema);
