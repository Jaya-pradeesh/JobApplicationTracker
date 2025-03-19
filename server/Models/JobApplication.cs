namespace JobApplicationTracker.Models
{
    public class JobApplication
{
    public int Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CompanyId { get; set; } = string.Empty;
    public DateTime AppliedDate { get; set; }
    public string UserId { get; set; } = string.Empty;
}
}
