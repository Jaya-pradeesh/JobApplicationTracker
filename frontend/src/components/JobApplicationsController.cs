using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobApplicationTracker.Models;
using JobApplicationTracker.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace JobApplicationTracker.Controllers
{
    [Authorize(Policy = "Employee")]
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
public async Task<ActionResult<JobApplication>> PostJobApplication(JobApplication jobApplication)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized(new { Message = "User ID not found. Ensure you are logged in." });
    }

    jobApplication.UserId = userId; // Associate the job application with the logged-in user
    _context.JobApplications.Add(jobApplication);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetJobApplication", new { id = jobApplication.Id }, jobApplication);
}


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
        query = query.Where(j => j.CompanyId == userId); // Assuming CompanyId is stored
    }

    var jobApplications = await query.ToListAsync();
    return Ok(jobApplications);
}

    }
}