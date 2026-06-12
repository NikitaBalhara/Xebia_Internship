const applyJob = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Application Submitted Successfully!",
    data: {
      _id: "app_mock_1",
      status: "applied",
      appliedAt: new Date(),
      jobId: {
        _id: req.body.jobId || "job1",
        title: "Frontend Web Developer",
        company: "TechSolutions Inc.",
        location: "Delhi (Remote)"
      }
    }
  });
};

const getApplications = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      {
        _id: "app_mock_1",
        status: "interviewing",
        appliedAt: new Date(),
        jobId: {
          _id: "job1",
          title: "Frontend Web Developer",
          company: "TechSolutions Inc.",
          location: "Delhi (Remote)"
        }
      }
    ]
  });
};

const updateApplicationStatus = async (req, res) => {
  return res.status(200).json({ success: true });
};

module.exports = {
  applyJob,
  getApplications,
  updateApplicationStatus
};