const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  college: {
    type: String,
    required: [true, 'Please add a college name']
  },
  branch: {
    type: String,
    required: [true, 'Please add a branch/specialization']
  },
  graduationYear: {
    type: Number,
    required: [true, 'Please add your graduation year']
  },
  skills: {
    type: [String],
    default: []
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  resumeScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
