using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly JobNetContext _context;
        private readonly Lazy<IRoleRepository> _roleRepository;
        private readonly Lazy<ITagRepository> _tagRepository;
        private readonly Lazy<IUserRepository> _userRepository;
        private readonly Lazy<IJobRepository> _jobRepository;
        private readonly Lazy<ICategoryRepository> _categoryRepository;
        private readonly Lazy<IResumeRepository> _resumeRepository;
        private readonly Lazy<IBlogPostRepository> _blogPostRepository;
        private readonly Lazy<IServiceRepository> _serviceRepository;
        private readonly Lazy<IReviewRepository> _reviewRepository;
        private readonly Lazy<IJobTagRepository> _jobTagRepository;
        private readonly Lazy<IServiceTagRepository> _serviceTagRepository;
        private readonly Lazy<ISubscriptionRepository> _subscriptionRepository;
        private readonly Lazy<ISubscriptionPlanRepository> _subscriptionPlanRepository;
        private readonly Lazy<IComplaintRepository> _complaintRepository;
        private readonly Lazy<IWarningRepository> _warningRepository;
        private readonly Lazy<ILikedPostRepository> _likedPostRepository;
        private readonly Lazy<ISavedJobRepository> _savedJobRepository;
        private readonly Lazy<IServiceVoteRepository> _serviceVoteRepository;
        private readonly Lazy<IOrderRepository> _orderRepository;
        private readonly Lazy<IBlogPostVoteRepository> _blogPostVoteRepository;
        private readonly Lazy<IPostCommentRepository> _postCommentRepository;
        private readonly Lazy<ISavedBlogPostRepository> _savedBlogPostRepository;

        public UnitOfWork(JobNetContext context)
        {
            _context = context;
            _roleRepository = new Lazy<IRoleRepository>(()=> new RoleRepository(_context));
            _tagRepository = new Lazy<ITagRepository>(() => new TagRepository(_context));
            _userRepository = new Lazy<IUserRepository>(() => new UserRepository(_context));
            _jobRepository = new Lazy<IJobRepository>(() => new JobRepository(_context));
            _categoryRepository = new Lazy<ICategoryRepository>(() => new CategoryRepository(_context));
            _resumeRepository = new Lazy<IResumeRepository>(() => new ResumeRepository(_context));
            _blogPostRepository = new Lazy<IBlogPostRepository>(() => new BlogPostRepository(_context));
            _serviceRepository = new Lazy<IServiceRepository>(() => new ServiceRepository(_context));
            _reviewRepository = new Lazy<IReviewRepository>(() => new ReviewRepository(_context));
            _jobTagRepository = new Lazy<IJobTagRepository>(() => new JobTagRepository(_context));
            _serviceTagRepository = new Lazy<IServiceTagRepository>(() => new ServiceTagRepository(_context));
            _subscriptionRepository = new Lazy<ISubscriptionRepository>(() => new SubscriptionRepository(_context));
            _subscriptionPlanRepository = new Lazy<ISubscriptionPlanRepository>(() => new SubscriptionPlanRepository(_context));
            _complaintRepository = new Lazy<IComplaintRepository>(() => new ComplaintRepository(_context));
            _warningRepository = new Lazy<IWarningRepository>(() => new WarningRepository(_context));
            _likedPostRepository = new Lazy<ILikedPostRepository>(() => new LikedPostRepository(_context));
            _savedJobRepository = new Lazy<ISavedJobRepository>(() => new SavedJobRepository(_context));
            _serviceVoteRepository = new Lazy<IServiceVoteRepository>(() => new ServiceVoteRepository(_context));
            _orderRepository = new Lazy<IOrderRepository>(() => new OrderRepository(_context));
            _blogPostVoteRepository = new Lazy<IBlogPostVoteRepository>(() => new BlogPostVoteRepository(_context));
            _postCommentRepository = new Lazy<IPostCommentRepository>(() => new PostCommentRepository(_context));
            _savedBlogPostRepository = new Lazy<ISavedBlogPostRepository>(() => new SavedBlogPostRepository(_context));
        }
        public IRoleRepository RoleRepository => _roleRepository.Value;
        public ITagRepository TagRepository => _tagRepository.Value;
        public IUserRepository UserRepository => _userRepository.Value;
        public IJobRepository JobRepository => _jobRepository.Value;
        public ICategoryRepository CategoryRepository => _categoryRepository.Value;
        public IResumeRepository ResumeRepository => _resumeRepository.Value;
        public IBlogPostRepository BlogPostRepository => _blogPostRepository.Value;
        public IServiceRepository ServiceRepository => _serviceRepository.Value;
        public IReviewRepository ReviewRepository => _reviewRepository.Value;
        public IJobTagRepository JobTagRepository => _jobTagRepository.Value;
        public IServiceTagRepository ServiceTagRepository => _serviceTagRepository.Value;
        public ISubscriptionRepository SubscriptionRepository => _subscriptionRepository.Value;
        public ISubscriptionPlanRepository SubscriptionPlanRepository => _subscriptionPlanRepository.Value;
        public IComplaintRepository ComplaintRepository => _complaintRepository.Value;
        public IWarningRepository WarningRepository => _warningRepository.Value;
        public ILikedPostRepository LikedPostRepository => _likedPostRepository.Value;
        public ISavedJobRepository SavedJobRepository => _savedJobRepository.Value;
        public IServiceVoteRepository ServiceVoteRepository => _serviceVoteRepository.Value;
        public IOrderRepository OrderRepository => _orderRepository.Value;
        public IBlogPostVoteRepository BlogPostVoteRepository => _blogPostVoteRepository.Value;
        public IPostCommentRepository PostCommentRepository => _postCommentRepository.Value;
        public ISavedBlogPostRepository SavedBlogPostRepository => _savedBlogPostRepository.Value;

        

        public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();

        public void Dispose() => _context.Dispose();
    }
}
