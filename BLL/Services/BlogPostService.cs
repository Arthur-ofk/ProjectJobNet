using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;


namespace BLL.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        

        public BlogPostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
           
        }

        public async Task<IEnumerable<BlogPostDto>> GetAllBlogPostsAsync()
        {
            var blogPosts = await _unitOfWork.BlogPostRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BlogPostDto>>(blogPosts);
        }

        public async Task<BlogPostDto> GetBlogPostByIdAsync(Guid id)
        {
            var blogPost = await _unitOfWork.BlogPostRepository.GetByIdAsync(id);
            return _mapper.Map<BlogPostDto>(blogPost);
        }

        public async Task<IEnumerable<BlogPostDto>> GetPagedBlogPostsAsync(int skip, int take)
        {
            var posts = await _unitOfWork.BlogPostRepository.GetPagedAsync(
                skip, 
                take, 
                orderBy: q => q.CreatedAt // Order ascending by CreatedAt; adjust if needed (e.g., descending)
            );
            return _mapper.Map<IEnumerable<BlogPostDto>>(posts);
        }

        public async Task<BlogPostDto> AddBlogPostAsync(CreateBlogPostDto dto)
        {
            var blogPost = _mapper.Map<BlogPost>(dto);
            blogPost.CreatedAt = DateTime.UtcNow;
            blogPost.UpdatedAt = DateTime.UtcNow;

            // only map binary if a file was actually uploaded
            if (dto.Image != null && dto.Image.Length > 0)
            {
                using var ms = new MemoryStream();
                await dto.Image.CopyToAsync(ms);
                blogPost.ImageData = ms.ToArray();
                blogPost.ImageContentType = dto.Image.ContentType;
            }

            await _unitOfWork.BlogPostRepository.AddAsync(blogPost);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<BlogPostDto>(blogPost);
        }

        public async Task UpdateBlogPostAsync(Guid id, UpdateBlogPostDto updateBlogPostDto)
        {
            var blogPost = await _unitOfWork.BlogPostRepository.GetByIdAsync(id);
            if (blogPost == null) return;

            _mapper.Map(updateBlogPostDto, blogPost);
            blogPost.UpdatedAt = DateTime.Now;

            _unitOfWork.BlogPostRepository.Update(blogPost);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteBlogPostAsync(Guid id)
        {
            var blogPost = await _unitOfWork.BlogPostRepository.GetByIdAsync(id);
            if (blogPost == null) return;

            _unitOfWork.BlogPostRepository.Remove(blogPost);
            await _unitOfWork.CompleteAsync();
        }
    }
}
