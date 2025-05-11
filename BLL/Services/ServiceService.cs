using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Service;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServiceService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            var services = await _unitOfWork.ServiceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

        public async Task<ServiceDto> GetServiceByIdAsync(Guid id)
        {
            var service = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            return _mapper.Map<ServiceDto>(service);
        }

        public async Task AddServiceAsync(CreateServiceDto createServiceDto)
        {
            var service = _mapper.Map<Service>(createServiceDto);
            service.CreatedAt = DateTime.Now;
            service.UpdatedAt = DateTime.Now;

            await _unitOfWork.ServiceRepository.AddAsync(service);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateServiceAsync(Guid id, CreateServiceDto updateServiceDto)
        {
            var service = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            if (service == null) return;

            _mapper.Map(updateServiceDto, service);
            service.UpdatedAt = DateTime.Now;

            _unitOfWork.ServiceRepository.Update(service);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteServiceAsync(Guid id)
        {
            var service = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            if (service == null) return;

            _unitOfWork.ServiceRepository.Remove(service);
            await _unitOfWork.CompleteAsync();
        }
    }
}
