using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobApplicationTracker.Models;
using JobApplicationTracker.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace JobApplicationTracker.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobPostingController(ApplicationDbContext context)
        {
            _context = context;
        }
        [AllowAnonymous] 
        [HttpPost]
public async Task<ActionResult<JobPosting>> PostJobPosting(JobPosting jobPosting)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Get the logged-in user's ID
    jobPosting.UserId = userId; // Associate the job posting with the user
    _context.JobPostings.Add(jobPosting);
    await _context.SaveChangesAsync();
    return CreatedAtAction("GetJobPosting", new { id = jobPosting.Id }, jobPosting);
}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobPosting>>> GetJobPostings()
        {
            return await _context.JobPostings.ToListAsync();
        }
    }
}