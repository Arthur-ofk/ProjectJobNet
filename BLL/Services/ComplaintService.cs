using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Complaint;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ComplaintService : IComplaintService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ComplaintService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ComplaintDto>> GetAllComplaintsAsync()
        {
            var complaints = await _unitOfWork.ComplaintRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ComplaintDto>>(complaints);
        }

        public async Task<ComplaintDto> GetComplaintByIdAsync(Guid id)
        {
            var complaint = await _unitOfWork.ComplaintRepository.GetByIdAsync(id);
            return _mapper.Map<ComplaintDto>(complaint);
        }

        public async Task AddComplaintAsync(CreateComplaintDto createComplaintDto)
        {
            var complaint = _mapper.Map<Complaint>(createComplaintDto);
            complaint.SubmittedAt = DateTime.Now;
            complaint.Id = Guid.NewGuid();
            await _unitOfWork.ComplaintRepository.AddAsync(complaint);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateComplaintAsync(Guid id, UpdateComplaintDto updateComplaintDto)
        {
            var complaint = await _unitOfWork.ComplaintRepository.GetByIdAsync(id);
            if (complaint == null) return;

            _mapper.Map(updateComplaintDto, complaint);
            

            _unitOfWork.ComplaintRepository.Update(complaint);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteComplaintAsync(Guid id)
        {
            var complaint = await _unitOfWork.ComplaintRepository.GetByIdAsync(id);
            if (complaint == null) return;

            _unitOfWork.ComplaintRepository.Remove(complaint);
            await _unitOfWork.CompleteAsync();
        }
    }
}
