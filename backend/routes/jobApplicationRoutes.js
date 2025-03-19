const express = require("express");
const {
  getJobApplications,
  createJobApplication,
} = require("../controllers/jobApplicationController");

const router = express.Router();

router.get("/", getJobApplications);
router.post("/", createJobApplication);

module.exports = router;