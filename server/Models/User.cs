using Microsoft.AspNetCore.Identity;

namespace JobApplicationTracker.Models
{
    public class User : IdentityUser
{
    public string Role { get; set; } = string.Empty; // Initialize with a default value
}
}