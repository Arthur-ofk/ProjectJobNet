using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Resume;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ResumeService : IResumeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ResumeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ResumeDto>> GetAllResumesAsync()
        {
            var resumes = await _unitOfWork.ResumeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ResumeDto>>(resumes);
        }

        public async Task<ResumeDto> GetResumeByIdAsync(Guid id)
        {
            var resume = await _unitOfWork.ResumeRepository.GetByIdAsync(id);
            return _mapper.Map<ResumeDto>(resume);
        }

        public async Task AddResumeAsync(CreateResumeDto createResumeDto)
        {
            var resume = _mapper.Map<Resume>(createResumeDto);
            resume.CreatedAt = DateTime.Now;

            await _unitOfWork.ResumeRepository.AddAsync(resume);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateResumeAsync(Guid id, CreateResumeDto updateResumeDto)
        {
            var resume = await _unitOfWork.ResumeRepository.GetByIdAsync(id);
            if (resume == null) return;

            _mapper.Map(updateResumeDto, resume);
            resume.UpdatedAt = DateTime.Now;

            _unitOfWork.ResumeRepository.Update(resume);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteResumeAsync(Guid id)
        {
            var resume = await _unitOfWork.ResumeRepository.GetByIdAsync(id);
            if (resume == null) return;

            _unitOfWork.ResumeRepository.Remove(resume);
            await _unitOfWork.CompleteAsync();
        }
    }
}
