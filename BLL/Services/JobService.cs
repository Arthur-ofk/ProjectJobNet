using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Job;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class JobService : IJobService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public JobService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            var jobs = await _unitOfWork.JobRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<JobDto>>(jobs);
        }

        public async Task<JobDto> GetJobByIdAsync(Guid id)
        {
            var job = await _unitOfWork.JobRepository.GetByIdAsync(id);
            return _mapper.Map<JobDto>(job);
        }

        public async Task AddJobAsync(CreateJobDto createJobDto)
        {
            var job = _mapper.Map<Job>(createJobDto);
            job.CreatedAt = DateTime.Now;
            job.UpdatedAt = DateTime.Now;

            await _unitOfWork.JobRepository.AddAsync(job);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateJobAsync(Guid id, UpdateJobDto updateJobDto)
        {
            var job = await _unitOfWork.JobRepository.GetByIdAsync(id);
            if (job == null) return;

            _mapper.Map(updateJobDto, job);
            job.UpdatedAt = DateTime.Now;

            _unitOfWork.JobRepository.Update(job);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteJobAsync(Guid id)
        {
            var job = await _unitOfWork.JobRepository.GetByIdAsync(id);
            if (job == null) return;

            _unitOfWork.JobRepository.Remove(job);
            await _unitOfWork.CompleteAsync();
        }
    }
}
