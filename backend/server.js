const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Job Posting Schema & Model
const JobPostingSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: Number,
  description: String,
  joiningDate: Date,
  createdAt: { type: Date, default: Date.now },
});
const JobPosting = mongoose.model("JobPosting", JobPostingSchema);

// ✅ Job Application Schema & Model
const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true },
  company: String,
  position: String,
  employeeName: String,
  employeeEmail: String,
  resumeLink: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

// ✅ Job Posting Routes
app.get("/api/jobpostings", async (req, res) => {
  try {
    const jobPostings = await JobPosting.find().sort({ createdAt: -1 });
    res.json(jobPostings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/jobpostings", async (req, res) => {
  try {
    const newJob = new JobPosting(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Job Application Routes
app.post("/api/jobapplications", async (req, res) => {
  try {
    const newApplication = new JobApplication(req.body);
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/jobapplications", async (req, res) => {
  try {
    const jobApplications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(jobApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/jobapplications/company", async (req, res) => {
  try {
    const { company } = req.query;
    const applications = await JobApplication.find({ company });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/jobapplications/:id", async (req, res) => {
  try {
    const updatedApplication = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/jobapplications/user", async (req, res) => {
  const { email } = req.query; // Get email from query params
  try {
    const applications = await JobApplication.find({ employeeEmail: email }); // Assuming JobApplication is your Mongoose model
    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));