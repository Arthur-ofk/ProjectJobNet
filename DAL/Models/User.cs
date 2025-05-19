using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        
        // Profile image fields - storing directly in DB like BlogPost images
        public string? ProfilePictureUrl { get; set; }
        public string? ProfileImageData { get; set; }
        public string? ProfileImageContentType { get; set; }
        
        // The old URL field - keep for backward compatibility
        
        
        public Guid RoleId { get; set; }
        public virtual Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<Job> Jobs { get; set; } = new List<Job>();
        public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
        public ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<LikedPost> LikedPosts { get; set; } = new List<LikedPost>();
        public ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();
        public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

        // New navigation properties for blog post extra entities:
        public ICollection<BlogPostVote> BlogPostVotes { get; set; } = new List<BlogPostVote>();
        public ICollection<PostComment> PostComments { get; set; } = new List<PostComment>();
        public ICollection<SavedBlogPost> SavedBlogPosts { get; set; } = new List<SavedBlogPost>();

        // New navigation property for organizations:
        public ICollection<OrganizationUser> Organizations { get; set; }
    }
}
