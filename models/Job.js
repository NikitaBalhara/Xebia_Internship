const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  salary: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  skills: {
    type: [String],
    default: []
  },
  deadline: {
    type: Date,
    required: [true, 'Please add an application deadline']
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);
