using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Warning;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class WarningService : IWarningService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WarningService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<WarningDto>> GetAllWarningsAsync()
        {
            var warnings = await _unitOfWork.WarningRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<WarningDto>>(warnings);
        }

        public async Task<WarningDto> GetWarningByIdAsync(Guid id)
        {
            var warning = await _unitOfWork.WarningRepository.GetByIdAsync(id);
            return _mapper.Map<WarningDto>(warning);
        }

        public async Task AddWarningAsync(CreateWarningDto createWarningDto)
        {
            var warning = _mapper.Map<Warning>(createWarningDto);
            warning.SentAt = DateTime.Now;

            await _unitOfWork.WarningRepository.AddAsync(warning);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteWarningAsync(Guid id)
        {
            var warning = await _unitOfWork.WarningRepository.GetByIdAsync(id);
            if (warning == null) return;

            _unitOfWork.WarningRepository.Remove(warning);
            await _unitOfWork.CompleteAsync();
        }
    }
}
