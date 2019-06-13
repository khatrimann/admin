var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocal = require('passport-local-mongoose');

var userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    roles: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    activationToken: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId
    }
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model('User', userSchema);