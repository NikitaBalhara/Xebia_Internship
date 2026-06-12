// backend/controllers/aiController.js
const axios = require('axios');

// @desc    Generate cover letter via AI microservice
// @route   POST /api/ai/cover-letter
// @access  Private (Student)
exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, error: 'resumeText and jobDescription required' });
    }
    // Call AI microservice (FastAPI) – placeholder URL
    const response = await axios.post('http://localhost:8000/cover-letter', {
      resume: resumeText,
      job: jobDescription
    });
    res.status(200).json({ success: true, coverLetter: response.data.cover_letter });
  } catch (error) {
    console.error('Cover letter generation error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate cover letter' });
  }
};

// @desc    Analyze video resume via AI microservice
// @route   POST /api/ai/video-resume
// @access  Private (Student)
exports.analyzeVideoResume = async (req, res, next) => {
  try {
    // Assuming video is uploaded via multipart/form-data and available as req.file
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Video file required' });
    }
    // For placeholder, just return mock analysis
    const mockResult = {
      confidence: 0.85,
      strengths: ['Clear speech', 'Professional attire'],
      improvements: ['Better lighting']
    };
    res.status(200).json({ success: true, analysis: mockResult });
  } catch (error) {
    console.error('Video resume analysis error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to analyze video resume' });
  }
};
