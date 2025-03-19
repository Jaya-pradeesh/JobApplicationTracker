import React, { useEffect, useState } from "react";
import "./CompanyDashboard.css";

const CompanyDashboard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", salary: "", description: "", joiningDate: "" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const companyName = ""; // Replace with actual company name

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobapplications/company?company=${companyName}`);
        const data = await response.json();
        setJobApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    
    const fetchJobPostings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobpostings");
        const data = await response.json();
        setJobPostings(data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };

    fetchApplications();
    fetchJobPostings();
    setIsLoading(false);
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/jobapplications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setJobApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/jobpostings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      const data = await response.json();
      setJobPostings([...jobPostings, data]);
      setNewJob({ title: "", company: "", location: "", salary: "", description: "", joiningDate: "" });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="company-dashboard">
      <h1>Welcome to Your Dashboard</h1>
      
      {/* Job Posting Section */}
      <div className="job-posting-form">
        <h2>Create Job Opening</h2>
        <form onSubmit={handleJobPost}>
          <input type="text" placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
          <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required />
          <input type="number" placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} required />
          <input type="date" placeholder="Joining Date" value={newJob.joiningDate} onChange={(e) => setNewJob({ ...newJob, joiningDate: e.target.value })} required />
          <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} required />
          <button type="submit">Post Job</button>
          {showSuccessMessage && <div className="success-message">Job posted successfully!</div>}
        </form>
      </div>
      
      {/* Job Applications Section */}
      <div className="job-applications">
        <h2>Employee Applications</h2>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          jobApplications.map((app) => (
            <div key={app._id} className="application-card">
              <p><strong>{app.employeeName}</strong> applied for <strong>{app.position}</strong></p>
              <p><strong>Resume Link:</strong> <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">Resume</a></p>

              <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
              <div className="actions">
                <button className="accept-btn" onClick={() => handleStatusUpdate(app._id, "Accepted")}>Accept</button>
                <button className="reject-btn" onClick={() => handleStatusUpdate(app._id, "Rejected")}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;