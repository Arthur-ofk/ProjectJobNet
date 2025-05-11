using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Tag;
using DAL;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class TagService : ITagService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TagService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TagDto>> GetAllTagsAsync()
        {
            var tags = await _unitOfWork.TagRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TagDto>>(tags);
        }

        public async Task<TagDto> GetTagByIdAsync(Guid id)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(id);
            return _mapper.Map<TagDto>(tag);
        }

        public async Task AddTagAsync(CreateTagDto createTagDto)
        {
            var tag = _mapper.Map<Tag>(createTagDto);
            tag.CreatedAt = DateTime.Now; // Set CreatedAt when adding
            tag.UpdatedAt = DateTime.Now; // Initial value for UpdatedAt

            await _unitOfWork.TagRepository.AddAsync(tag);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateTagAsync(Guid id, UpdateTagDto updateTagDto)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(id);
            if (tag == null) return;

            _mapper.Map(updateTagDto, tag);
            tag.UpdatedAt = DateTime.Now; // Update UpdatedAt automatically

            _unitOfWork.TagRepository.Update(tag);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteTagAsync(Guid id)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(id);
            if (tag == null) return;

            _unitOfWork.TagRepository.Remove(tag);
            await _unitOfWork.CompleteAsync();
        }

        
    }
}
