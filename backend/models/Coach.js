const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  specialty: {
    type: String,
    required: true,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  availability: [{
    date: { type: Date, required: true },
    timeSlots: [{ type: String, required: true }], // e.g., ["09:00", "10:00"]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coach', coachSchema);