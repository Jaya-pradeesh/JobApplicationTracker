using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobApplicationTracker.Models;
using JobApplicationTracker.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobApplicationTracker.Controllers
{
    [Authorize] // ✅ Ensure the controller requires authentication
    [Route("api/jobapplication")] // ✅ Explicitly set correct route
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Create a new job application
        [HttpPost]
        public async Task<ActionResult<JobApplication>> PostJobApplication(JobApplication jobApplication)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found. Ensure you are logged in." });
            }

            jobApplication.UserId = userId;
            _context.JobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobApplication), new { id = jobApplication.Id }, jobApplication);
        }

        // ✅ Get all job applications (Filtered by Role)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplication>>> GetJobApplications()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userRole))
            {
                return Unauthorized(new { Message = "User information is missing. Please log in." });
            }

            IQueryable<JobApplication> query = _context.JobApplications;

            if (userRole == "Employee")
            {
                query = query.Where(j => j.UserId == userId);
            }
            else if (userRole == "Company")
            {
                query = query.Where(j => j.CompanyId == userId);
            }

            var jobApplications = await query.ToListAsync();
            return Ok(jobApplications);
        }

        // ✅ Get single job application by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplication>> GetJobApplication(int id)
        {
            var jobApplication = await _context.JobApplications.FindAsync(id);
            if (jobApplication == null)
            {
                return NotFound();
            }
            return jobApplication;
        }
    }
}