const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const userName = req.body.name || req.body.email?.split('@')[0] || "User"
    const userEmail = req.body.email || "user@example.com"
    const token = jwt.sign(
      { id: "mock_user_123", email: userEmail, name: userName, role: "student" },
      process.env.JWT_SECRET || "super_secret_career_genie_key",
      { expiresIn: '30d' }
    );
    return res.status(200).json({
      success: true,
      token: token,
      user: { _id: "mock_user_123", name: userName, email: userEmail, role: "student" }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const userName = req.body.name || "User"
    const userEmail = req.body.email || "user@example.com"
    const token = jwt.sign(
      { id: "mock_user_123", email: userEmail, name: userName, role: "student" },
      process.env.JWT_SECRET || "super_secret_career_genie_key",
      { expiresIn: '30d' }
    );
    return res.status(201).json({
      success: true,
      token: token,
      user: { _id: "mock_user_123", name: userName, email: userEmail, role: "student" }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, message: "No token" })
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_career_genie_key")
    return res.status(200).json({
      success: true,
      user: {
        _id: decoded.id,
        name: decoded.name || decoded.email?.split('@')[0] || "User",
        email: decoded.email,
        role: decoded.role || "student"
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};