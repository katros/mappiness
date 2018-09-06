const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Story = require('./Story');
const validate = require('mongoose-validator');

var usernameValidator = validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Username should contain alpha-numeric characters only'
});

const userSchema = new Schema({
    username: {
        type: String,
        default: 'unknown',
        unique: 'true',
        validate: usernameValidator
    },
    email: String,
    password: String,
    following: [{ type: Schema.Types.String, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
