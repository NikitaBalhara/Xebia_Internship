const mockUser = {
  _id: "dummy123",
  name: "Test Student",
  email: "test@gmail.com",
  role: "student",
  skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "TailwindCSS"],
  location: "Delhi NCR",
  isProfileComplete: true
};

const protect = async (req, res, next) => {
  req.user = mockUser;
  next();
};

const protectOptional = async (req, res, next) => {
  req.user = mockUser;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = {
  protect,
  protectOptional,
  authorize
};