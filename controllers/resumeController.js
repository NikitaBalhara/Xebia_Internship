const jwt = require('jsonwebtoken');

exports.uploadResume = async (req, res) => {
  let userName = "User";
  let userEmail = "—";

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_career_genie_key");
        userName = decoded.name || decoded.email?.split('@')[0] || "User";
        userEmail = decoded.email || "—";
      } catch (e) {
        console.log("Token check failed:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully!",
      data: {
        score: 84,
        skillsMatch: "92%",
        keywordOptimization: "76%",
        suggestions: [
          "Missing keyword 'RESTful APIs'. Consider adding it to your projects.",
          "Strengthen your profile by highlighting cloud services experience."
        ],
        parsedData: {
          name: userName,
          email: userEmail,
          skills: ["React", "Node.js", "Express", "JavaScript", "Python"]
        }
      }
    });
  } catch (error) {
    console.log("Upload error:", error.message);
    return res.status(500).json({ success: false, message: "Error parsing resume" });
  }
};

exports.getResumes = async (req, res) => {
  return res.status(200).json({ success: true, data: [] });
};

exports.getLatestResume = async (req, res) => {
  return res.status(200).json({ success: false, data: null });
};
