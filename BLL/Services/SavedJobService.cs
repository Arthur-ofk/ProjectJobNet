using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.SavedJob;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class SavedJobService : ISavedJobService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SavedJobService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SavedJobDto>> GetAllSavedJobsAsync()
        {
            var savedJobs = await _unitOfWork.SavedJobRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SavedJobDto>>(savedJobs);
        }

        public async Task AddSavedJobAsync(CreateSavedJobDto createSavedJobDto)
        {
            var savedJob = _mapper.Map<SavedJob>(createSavedJobDto);
            savedJob.SavedAt = DateTime.Now;

            await _unitOfWork.SavedJobRepository.AddAsync(savedJob);
            await _unitOfWork.CompleteAsync();
        }

        public async Task RemoveSavedJobAsync(Guid employerId, Guid jobId)
        {
            var savedJob = await _unitOfWork.SavedJobRepository.GetByEmployerIdAndJobIdAsync(employerId, jobId);
            if (savedJob == null) return;

            _unitOfWork.SavedJobRepository.Remove(savedJob);
            await _unitOfWork.CompleteAsync();
        }
    }
}
