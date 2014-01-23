var mongoose = require('mongoose'),
    UserSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        createdAt: {
            type: Date, default: Date.now
        }
    });

module.exports = mongoose.model('User', UserSchema);