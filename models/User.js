const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Story = require('./Story');

const userSchema = new Schema({
    username: { type: String, default: 'unknown', unique: 'true' },
    email: String,
    password: String,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
