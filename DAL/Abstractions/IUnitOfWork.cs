using DAL.Models;
using DAL.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
      

        public interface IUnitOfWork : IDisposable
        {
            ITagRepository TagRepository { get; }
            IRoleRepository RoleRepository { get; }
            IUserRepository UserRepository { get; }
            IJobRepository JobRepository { get; }
            ICategoryRepository CategoryRepository { get; }
            IResumeRepository ResumeRepository { get; }
            IBlogPostRepository BlogPostRepository { get; }
            IServiceRepository ServiceRepository { get; }
            IReviewRepository ReviewRepository { get; }
            IJobTagRepository JobTagRepository { get; }
            IServiceTagRepository ServiceTagRepository { get; }
            ISubscriptionRepository SubscriptionRepository { get; }
            ISubscriptionPlanRepository SubscriptionPlanRepository { get; }
            IComplaintRepository ComplaintRepository { get; }
            IWarningRepository WarningRepository { get; }
            ILikedPostRepository LikedPostRepository { get; }
            ISavedJobRepository SavedJobRepository { get; }

            Task<int> CompleteAsync();
        }
    
}
