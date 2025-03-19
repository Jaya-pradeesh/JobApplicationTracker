const JobPosting = require("../models/JobPosting");

// Get all job postings
exports.getJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find().sort({ createdAt: -1 });
    res.json(jobPostings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new job posting
exports.createJobPosting = async (req, res) => {
  const { title, company, location, salary, description } = req.body;
  try {
    const newJobPosting = new JobPosting({
      title,
      company,
      location,
      salary,
      description,
    });
    await newJobPosting.save();
    res.status(201).json(newJobPosting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};