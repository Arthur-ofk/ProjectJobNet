using Microsoft.AspNetCore.Http;

public class CreateBlogPostDto {
    public string Title { get; set; }
    public string Content { get; set; }
    public string Tags { get; set; }
    public Guid UserId { get; set; }
    // New property for image file (if storing image URL after processing upload)
    public IFormFile Image { get; set; }
}
