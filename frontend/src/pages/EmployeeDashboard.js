import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faMoneyBillAlt,
  faCheckCircle,
  faTimesCircle,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    employeeName: "",
    employeeEmail: "",
    resumeLink: "",
  });
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job postings
        const jobPostingsResponse = await fetch("http://localhost:5000/api/jobpostings");
        const jobPostingsData = await jobPostingsResponse.json();
        setJobPostings(jobPostingsData);

        // Fetch user's job applications
        const applicationsResponse = await fetch(
          `http://localhost:5000/api/jobapplications/user?email=${userEmail}`
        );
        const applicationsData = await applicationsResponse.json();
        setUserApplications(applicationsData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userEmail]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/jobapplications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...applicationData,
          jobId: selectedJob._id,
          company: selectedJob.company,
          position: selectedJob.title,
        }),
      });
      if (response.ok) {
        alert("Application submitted successfully!");
        setShowModal(false);
        setApplicationData({ employeeName: "", employeeEmail: "", resumeLink: "" });

        // Refresh user applications after submission
        const applicationsResponse = await fetch(
          `http://localhost:5000/api/jobapplications/user?email=${userEmail}`
        );
        const applicationsData = await applicationsResponse.json();
        setUserApplications(applicationsData);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div className={`employee-dashboard ${showModal ? "blur-background" : ""}`}>
      <h1>Employee Dashboard</h1>
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {/* Job Listings Section */}
          <div className="job-listings">
            <h2>Available Job Postings</h2>
            {jobPostings.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <div className="job-details">
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Joining Date: {job.joiningDate}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faMoneyBillAlt} /> Salary: 💰 {job.salary} per year
                  </p>
                </div>
                <p className="job-description">{job.description}</p>
                <button className="apply-btn" onClick={() => handleApplyClick(job)}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          {/* User Applications Section */}
          <div className="user-applications">
            <h2>Your Job Applications</h2>
            {userApplications.length > 0 ? (
              userApplications.map((app) => (
                <div key={app._id} className="application-card">
                  <h3>{app.position}</h3>
                  <p>Company: {app.company}</p>
                  <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
                  <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>You haven't applied to any jobs yet.</p>
            )}
          </div>
        </>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Apply for {selectedJob.title}</h2>
              <form onSubmit={handleApplySubmit}>
                <div className="input-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={applicationData.employeeName}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, employeeName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Your Email</label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={applicationData.employeeEmail}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, employeeEmail: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Resume Link</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={applicationData.resumeLink}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, resumeLink: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    <FontAwesomeIcon icon={faCheckCircle} /> Submit Application
                  </button>
                  <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                    <FontAwesomeIcon icon={faTimesCircle} /> Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;