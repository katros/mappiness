const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const storySchema = new Schema(
    {
        story: String,
        creator: { type: Schema.Types.ObjectId },
        address: {
            street: String,
            city: String
        },
        location: {
            lat: Number,
            lng: Number
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
