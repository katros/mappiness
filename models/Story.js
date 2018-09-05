const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const storySchema = new Schema(
    {
        story: String,
        creatorId: { type: Schema.Types.ObjectId },
        username: String,
        address: {
            street: String,
            city_district: String,
            town: String,
            city: String,
            county: String,
            country: String
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
