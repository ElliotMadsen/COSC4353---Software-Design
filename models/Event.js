const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },

    description: {
        type: String, 
        required: true,
    },

    location: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
        },
        message: 'At least one skill is required'
        }
    },

    urgency: {
        type:String, 
        required: true,
        enum: ['Low', 'Medium', 'High']
    },

    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);