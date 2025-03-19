const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true }, // Link application to job
  company: { type: String, required: true },
  position: { type: String, required: true },
  employeeName: { type: String, required: true }, // Employee details
  employeeEmail: { type: String, required: true },
  resumeLink: { type: String, required: false },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
