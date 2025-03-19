using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobApplicationTracker.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JobApplicationTracker.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // ✅ Handle OPTIONS Preflight Requests (Fixes CORS)
        [HttpOptions("register")]
        public IActionResult Preflight()
        {
            return NoContent();
        }

        // ✅ User Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.Role))
                return BadRequest(new { Message = "Email, Password, and Role are required." });

            // Validate Role
            if (model.Role != "Employee" && model.Role != "Company")
                return BadRequest(new { Message = "Invalid Role. Allowed: Employee, Company." });

            var user = new User { UserName = model.Email, Email = model.Email, Role = model.Role };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(new { Message = "User registration failed", Errors = result.Errors });

            return Ok(new { Message = "User registered successfully" });
        }

        // ✅ User Login & JWT Token Generation
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { Message = "Email and Password are required." });

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { Message = "Invalid email or password." });

            // ✅ Generate JWT Token
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, Message = "Login successful" });
        }

        // ✅ Generate JWT Token (with User ID & Role)
        private string GenerateJwtToken(User user)
{
    var userId = user?.Id ?? throw new ArgumentNullException(nameof(user.Id), "User ID is null");
    var role = user?.Role ?? throw new ArgumentNullException(nameof(user.Role), "User role is null");
    
    var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? "unknown@example.com"), // Fallback for null email
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, userId), // ✅ Ensure User ID is set
        new Claim(ClaimTypes.Role, role) // ✅ Ensure Role is set
    };

    var keyString = _configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT Key is missing in appsettings.json.");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }

    // ✅ Registration Model (With Default Empty Strings)
    public class RegisterModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    // ✅ Login Model (With Default Empty Strings)
    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
