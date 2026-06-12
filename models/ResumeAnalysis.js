const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required']
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  suggestions: {
    structure: {
      score: Number,
      feedback: [String]
    },
    skills: {
      score: Number,
      feedback: [String],
      recommendedSkills: [String]
    },
    experience: {
      score: Number,
      feedback: [String]
    },
    projects: {
      score: Number,
      feedback: [String]
    },
    atsOptimization: {
      score: Number,
      feedback: [String],
      missingKeywords: [String]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
