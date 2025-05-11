using Bogus;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Seeding
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(JobNetContext context)
        {
            if (await context.Users.AnyAsync()) return; // Skip seeding if data exists

            // Generate Roles
            var roleFaker = new Faker<Role>()
                .RuleFor(r => r.Id, f => Guid.NewGuid())
                .RuleFor(r => r.RoleName, f => f.Name.JobType())
                .RuleFor(r => r.Description, f => f.Lorem.Sentence())
                .RuleFor(r => r.CreatedAt, f => f.Date.Past())
                .RuleFor(r => r.UpdatedAt, f => f.Date.Recent());
            var roles = roleFaker.Generate(5);

            // Generate Users
            var userFaker = new Faker<User>()
                .RuleFor(u => u.Id, f => Guid.NewGuid())
                .RuleFor(u => u.FirstName, f => f.Name.FirstName())
                .RuleFor(u => u.LastName, f => f.Name.LastName())
                .RuleFor(u => u.Email, f => f.Internet.Email())
                .RuleFor(u => u.Username, f => f.Internet.UserName())
                .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
                .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
                .RuleFor(u => u.Address, f => f.Address.FullAddress())
                .RuleFor(u => u.DateOfBirth, f => f.Date.Past(30, DateTime.Now.AddYears(-18)))
                .RuleFor(u => u.RoleId, f => f.PickRandom(roles).Id)
                .RuleFor(u => u.CreatedAt, f => f.Date.Past())
                .RuleFor(u => u.UpdatedAt, f => f.Date.Recent());
            var users = userFaker.Generate(20);

            // Generate Categories
            var categoryFaker = new Faker<Category>()
                .RuleFor(c => c.Id, f => Guid.NewGuid())
                .RuleFor(c => c.CategoryName, f => f.Commerce.Categories(1).First())
                .RuleFor(c => c.Description, f => f.Lorem.Paragraph())
                .RuleFor(c => c.CreatedAt, f => f.Date.Past())
                .RuleFor(c => c.UpdatedAt, f => f.Date.Recent());
            var categories = categoryFaker.Generate(10);

            // Generate SubscriptionPlans
            var subPlanFaker = new Faker<SubscriptionPlan>()
                .RuleFor(sp => sp.Id, f => Guid.NewGuid())
                .RuleFor(sp => sp.PlanName, f => f.Commerce.ProductName())
                .RuleFor(sp => sp.Price, f => f.Finance.Amount(10, 100))
                .RuleFor(sp => sp.Duration, f => f.Random.Int(30, 365))
                .RuleFor(sp => sp.CreatedAt, f => f.Date.Past())
                .RuleFor(sp => sp.UpdatedAt, f => f.Date.Recent());
            var subscriptionPlans = subPlanFaker.Generate(3);

            // Generate Jobs
            var jobFaker = new Faker<Job>()
                .RuleFor(j => j.Id, f => Guid.NewGuid())
                .RuleFor(j => j.Title, f => f.Name.JobTitle())
                .RuleFor(j => j.Description, f => f.Lorem.Paragraph())
                .RuleFor(j => j.Location, f => f.Address.City())
                .RuleFor(j => j.Salary, f => f.Finance.Amount(30000, 120000))
                .RuleFor(j => j.CategoryId, f => f.PickRandom(categories).Id)
                .RuleFor(j => j.UserId, f => f.PickRandom(users).Id)
                .RuleFor(j => j.CreatedAt, f => f.Date.Past())
                .RuleFor(j => j.UpdatedAt, f => f.Date.Recent());
            var jobs = jobFaker.Generate(50);

            // Generate Resumes
            var resumeFaker = new Faker<Resume>()
                .RuleFor(r => r.Id, f => Guid.NewGuid())
                .RuleFor(r => r.UserId, f => f.PickRandom(users).Id)
                
                .RuleFor(r => r.Content, f => f.Lorem.Paragraph())
                .RuleFor(r => r.CreatedAt, f => f.Date.Past())
                .RuleFor(r => r.UpdatedAt, f => f.Date.Recent());
            var resumes = resumeFaker.Generate(20);

            // Generate BlogPosts
            var blogPostFaker = new Faker<BlogPost>()
                .RuleFor(bp => bp.Id, f => Guid.NewGuid())
                .RuleFor(bp => bp.Title, f => f.Lorem.Sentence())
                .RuleFor(bp => bp.Content, f => f.Lorem.Paragraphs(3))
                .RuleFor(bp => bp.UserId, f => f.PickRandom(users).Id)
                .RuleFor(bp => bp.CreatedAt, f => f.Date.Past())
                .RuleFor(bp => bp.UpdatedAt, f => f.Date.Recent());
            var blogPosts = blogPostFaker.Generate(20);

            // Fix the issue by replacing the incorrect property 'Title' with the correct property 'ServiceName' 
            // as per the 'Service' class definition provided in the context.

            var serviceFaker = new Faker<Service>()
                .RuleFor(s => s.Id, f => Guid.NewGuid())
                .RuleFor(s => s.ServiceName, f => f.Company.CompanyName()) // Corrected property name
                .RuleFor(s => s.Description, f => f.Lorem.Paragraph())
                .RuleFor(s => s.UserId, f => f.PickRandom(users).Id)
                .RuleFor(s => s.CategoryId, f => f.PickRandom(categories).Id) // Assign a valid CategoryId
                .RuleFor(s => s.Price, f => f.Finance.Amount(10, 100))         // Assign a price
                .RuleFor(s => s.Upvotes, f => f.Random.Int(0, 50))      // Added upvotes
                .RuleFor(s => s.Downvotes, f => f.Random.Int(0, 10))    // Added downvotes
                .RuleFor(s => s.CreatedAt, f => f.Date.Past())
                .RuleFor(s => s.UpdatedAt, f => f.Date.Recent());
            var services = serviceFaker.Generate(30);

            // Generate Reviews
            var reviewFaker = new Faker<Review>()
                .RuleFor(r => r.Id, f => Guid.NewGuid())
                .RuleFor(r => r.AuthorId, f => f.PickRandom(users).Id)
                .RuleFor(r => r.TargetId, f => f.PickRandom(users).Id)
                .RuleFor(r => r.Rating, f => f.Random.Int(1, 5))
                .RuleFor(r => r.ReviewText, f => f.Lorem.Paragraph())
                .RuleFor(r => r.CreatedAt, f => f.Date.Past())
                .RuleFor(r => r.UpdatedAt, f => f.Date.Recent());
            var reviews = reviewFaker.Generate(30);

            // Generate Tags
            var tagFaker = new Faker<Tag>()
                .RuleFor(t => t.Id, f => Guid.NewGuid())
                .RuleFor(t => t.TagName, f => f.Lorem.Word())
                .RuleFor(t => t.CreatedAt, f => f.Date.Past())
                .RuleFor(t => t.UpdatedAt, f => f.Date.Recent());
            var tags = tagFaker.Generate(15);

            // Generate JobTags
            var jobTagFaker = new Faker<JobTag>()
                .RuleFor(jt => jt.JobId, f => f.PickRandom(jobs).Id)
                .RuleFor(jt => jt.TagId, f => f.PickRandom(tags).Id);
            var jobTags = jobTagFaker.Generate(30);

            // Remove duplicates based on the composite key (JobId, TagId)
            var distinctJobTags = jobTags
                .GroupBy(jt => new { jt.JobId, jt.TagId })
                .Select(g => g.First())
                .ToList();

            // Generate ServiceTags
            var serviceTagFaker = new Faker<ServiceTag>()
                .RuleFor(st => st.ServiceId, f => f.PickRandom(services).Id)
                .RuleFor(st => st.TagId, f => f.PickRandom(tags).Id);
            var serviceTags = serviceTagFaker.Generate(30);
            // Remove duplicates based on the composite key (ServiceId, TagId)
            var distinctServiceTags = serviceTags
                .GroupBy(st => new { st.ServiceId, st.TagId })
                .Select(g => g.First())
                .ToList();
            // Generate Subscriptions
            var subscriptionFaker = new Faker<Subscription>()
                .RuleFor(s => s.Id, f => Guid.NewGuid())
                .RuleFor(s => s.UserId, f => f.PickRandom(users).Id)
                .RuleFor(s => s.PlanId, f => f.PickRandom(subscriptionPlans).Id)
                .RuleFor(s => s.StartDate, f => f.Date.Past())
                .RuleFor(s => s.EndDate, (f, s) => f.Date.Future(1, s.StartDate))
                .RuleFor(s => s.CreatedAt, f => f.Date.Past())
                .RuleFor(s => s.UpdatedAt, f => f.Date.Recent());
            var subscriptions = subscriptionFaker.Generate(15);

            // Generate Complaints
            var complaintFaker = new Faker<Complaint>()
                .RuleFor(c => c.Id, f => Guid.NewGuid())
                .RuleFor(c => c.ComplainantId, f => f.PickRandom(users).Id)
                .RuleFor(c => c.TargetPostId, f => f.PickRandom(blogPosts).Id)
                .RuleFor(c => c.Description, f => f.Lorem.Sentence())
                .RuleFor(c => c.Status, f => "Pending") // Setting a default status value
                .RuleFor(c => c.SubmittedAt, f => f.Date.Past())
                .RuleFor(c => c.CreatedAt, f => f.Date.Past())
                .RuleFor(c => c.UpdatedAt, f => f.Date.Recent());
            var complaints = complaintFaker.Generate(10);

            // Generate Warnings
            var warningFaker = new Faker<Warning>()
                .RuleFor(w => w.Id, f => Guid.NewGuid())
                .RuleFor(w => w.ModeratorId, f => f.PickRandom(users).Id) // or filter for a moderator role if needed
                .RuleFor(w => w.UserId, f => f.PickRandom(users).Id)
                .RuleFor(w => w.ComplaintId, f => f.PickRandom(complaints).Id) // ensure an existing Complaint Id
                .RuleFor(w => w.Message, f => f.Lorem.Sentence())
                .RuleFor(w => w.SentAt, f => f.Date.Past())
                .RuleFor(w => w.CreatedAt, f => f.Date.Past())
                .RuleFor(w => w.UpdatedAt, f => f.Date.Recent());
            var warnings = warningFaker.Generate(10);

            // Generate LikedPosts
            var likedPostFaker = new Faker<LikedPost>()
                .RuleFor(lp => lp.UserId, f => f.PickRandom(users).Id)
                .RuleFor(lp => lp.PostId, f => f.PickRandom(blogPosts).Id)
                .RuleFor(lp => lp.LikedAt, f => f.Date.Past());
            var likedPosts = likedPostFaker.Generate(20);

            // Remove duplicates based on the composite key (UserId, PostId)
            var distinctLikedPosts = likedPosts
                .GroupBy(lp => new { lp.UserId, lp.PostId })
                .Select(g => g.First())
                .ToList();

            // Update the SavedJob faker configuration to match the correct properties of the SavedJob class.
            // Generate SavedJobs
            var savedJobFaker = new Faker<SavedJob>()
                .RuleFor(sj => sj.EmployerId, f => f.PickRandom(users).Id)
                .RuleFor(sj => sj.JobId, f => f.PickRandom(jobs).Id)
                .RuleFor(sj => sj.SavedAt, f => f.Date.Past());
            var savedJobs = savedJobFaker.Generate(20);

            // Remove duplicates based on the composite key (EmployerId, JobId)
            var distinctSavedJobs = savedJobs
                .GroupBy(sj => new { sj.EmployerId, sj.JobId })
                .Select(g => g.First())
                .ToList();

            // Add all data to context
            await context.Roles.AddRangeAsync(roles);
            await context.Users.AddRangeAsync(users);
            await context.Categories.AddRangeAsync(categories);
            await context.SubscriptionPlans.AddRangeAsync(subscriptionPlans);
            await context.Jobs.AddRangeAsync(jobs);
            await context.Resumes.AddRangeAsync(resumes);
            await context.BlogPosts.AddRangeAsync(blogPosts);
            await context.Services.AddRangeAsync(services);
            await context.Reviews.AddRangeAsync(reviews);
            await context.Tags.AddRangeAsync(tags);
            await context.JobTags.AddRangeAsync(distinctJobTags);
            await context.ServiceTags.AddRangeAsync(distinctServiceTags);
            await context.Subscriptions.AddRangeAsync(subscriptions);
            await context.Complaints.AddRangeAsync(complaints);
            await context.Warnings.AddRangeAsync(warnings);
            await context.LikedPosts.AddRangeAsync(distinctLikedPosts);
            await context.SavedJobs.AddRangeAsync(distinctSavedJobs);

            await context.SaveChangesAsync();
        }
    }
}