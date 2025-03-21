const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  dateMatched: {
    type: Date,
    default: Date.now
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Match', matchSchema);