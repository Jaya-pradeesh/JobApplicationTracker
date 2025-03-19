using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using JobApplicationTracker.Data;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using JobApplicationTracker.Models;

var builder = WebApplication.CreateBuilder(args);

// ✅ 1️⃣ Fix CORS Issue: Ensure frontend can access backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // ✅ Ensure frontend origin matches
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials(); // ✅ Important for JWT authentication
        });
});

// ✅ 2️⃣ Fix Authentication & Authorization
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing in appsettings.json.");
}

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = key
    };
});

// ✅ 3️⃣ Fix Role-Based Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Employee", policy => policy.RequireClaim(ClaimTypes.Role, "Employee"));
    options.AddPolicy("Company", policy => policy.RequireClaim(ClaimTypes.Role, "Company"));
});

// ✅ 4️⃣ Fix Database Context Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// ✅ 5️⃣ Add Identity Configuration
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false; // Disable email confirmation requirement
    options.Password.RequireNonAlphanumeric = false; // Optional: Simplify password requirements
    options.Password.RequireUppercase = false; // Optional: Simplify password requirements
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ✅ Ensure Unauthorized API requests return 401 instead of redirecting to login
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
});

// ✅ 6️⃣ Add Controllers
builder.Services.AddControllers();

// ✅ 7️⃣ Build App
var app = builder.Build();

// ✅ 8️⃣ Enable Exception Details in Development Mode
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // ✅ Helps debug issues
}

// ✅ 9️⃣ Fix CORS Middleware Order (Apply BEFORE authentication)
app.UseCors("AllowFrontend");

// ✅ 🔟 Middleware Setup
app.UseRouting(); // ✅ Enable Routing
app.UseAuthentication(); // ✅ Must be BEFORE authorization
app.UseAuthorization();

// ✅ 1️⃣1️⃣ Ensure API Returns Valid JSON (Fix `JSON.parse` error)
app.Use(async (context, next) =>
{
    await next(); // Process request first

    if (context.Response.StatusCode == 204) // No Content Response
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{}"); // ✅ Ensures empty JSON instead of blank response
    }
});

// ✅ 1️⃣2️⃣ Map Controllers & Start Application
app.MapControllers();
app.Run();
