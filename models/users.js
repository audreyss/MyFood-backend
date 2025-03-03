const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    token: String,
    fit: {
        type: Boolean, 
        default: false,
    },
    healthy: {
        type: Boolean, 
        default: false,
    },
    pregnant: {
        type: Boolean, 
        default: false,
    },
    glutenFree: {
        type: Boolean, 
        default: false,
    },
    vegetarian: {
        type: Boolean, 
        default: false,
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;