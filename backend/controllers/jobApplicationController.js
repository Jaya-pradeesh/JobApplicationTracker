const JobApplication = require("../models/JobApplication");

// Get all job applications
exports.getJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(jobApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new job application
exports.createJobApplication = async (req, res) => {
  const { company, position, status } = req.body;
  try {
    const newJobApplication = new JobApplication({
      company,
      position,
      status,
    });
    await newJobApplication.save();
    res.status(201).json(newJobApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get job applications for a specific company
exports.getCompanyJobApplications = async (req, res) => {
  const { company } = req.query;

  try {
    const jobApplications = await JobApplication.find({ company }).sort({ createdAt: -1 });
    res.json(jobApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  const { jobId, company, position, employeeName, employeeEmail, resumeLink } = req.body;

  try {
    const newApplication = new JobApplication({
      jobId,
      company,
      position,
      employeeName,
      employeeEmail,
      resumeLink,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};