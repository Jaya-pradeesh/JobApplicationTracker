const express = require("express");
const {
  getJobPostings,
  createJobPosting,
} = require("../controllers/jobPostingController");

const router = express.Router();

router.get("/", getJobPostings);
router.post("/", createJobPosting);

module.exports = router;