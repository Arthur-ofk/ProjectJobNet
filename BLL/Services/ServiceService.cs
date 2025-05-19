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
            service.Upvotes = 0; // Ensure default
            service.Downvotes = 0; // Ensure default

            await _unitOfWork.ServiceRepository.AddAsync(service);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateServiceAsync(Guid id, CreateServiceDto updateServiceDto)
        {
            var service = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            if (service == null) return;

            _mapper.Map(updateServiceDto, service);
            service.UpdatedAt = DateTime.Now;
            // Upvotes/Downvotes will be mapped if present in DTO

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

        public async Task<bool> HasUserUsedService(Guid serviceId, Guid userId)
        {
            // Query the Order repository for an order where this user (as customer) has a finished order for the service
            var orders = await _unitOfWork.OrderRepository.FindAsync(o =>
                             o.ServiceId == serviceId &&
                             o.CustomerId == userId &&
                             o.Status.ToLower() == "finished");
            return orders.Any();
        }

        public async Task<bool> VoteServiceAsync(Guid serviceId, Guid userId, bool isUpvote)
        {
            // Check if user has used the service
            if (!await HasUserUsedService(serviceId, userId))
                return false;

            var existingVote = (await _unitOfWork.ServiceVoteRepository.FindAsync(v => v.ServiceId == serviceId && v.UserId == userId))
                                .FirstOrDefault();

            if (existingVote != null)
            {
                if (existingVote.IsUpvote == isUpvote)
                {
                    // Toggle off: remove the existing vote.
                    _unitOfWork.ServiceVoteRepository.Remove(existingVote);
                }
                else
                {
                    // Change vote: update the vote.
                    existingVote.IsUpvote = isUpvote;
                    existingVote.CreatedAt = DateTime.UtcNow;
                    _unitOfWork.ServiceVoteRepository.Update(existingVote);
                }
            }
            else
            {
                // No vote exists; add a new vote.
                await _unitOfWork.ServiceVoteRepository.AddAsync(new ServiceVote
                {
                    Id = Guid.NewGuid(),
                    ServiceId = serviceId,
                    UserId = userId,
                    IsUpvote = isUpvote,
                    CreatedAt = DateTime.UtcNow
                });
            }
            // Recalculate vote counts.
            var votes = await _unitOfWork.ServiceVoteRepository.FindAsync(v => v.ServiceId == serviceId);
            var service = await _unitOfWork.ServiceRepository.GetByIdAsync(serviceId);
            service.Upvotes = votes.Count(v => v.IsUpvote);
            service.Downvotes = votes.Count(v => !v.IsUpvote);
            _unitOfWork.ServiceRepository.Update(service);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<ServiceVoteDto?> GetUserVoteAsync(Guid serviceId, Guid userId)
        {
            var vote = (await _unitOfWork.ServiceVoteRepository.FindAsync(v => v.ServiceId == serviceId && v.UserId == userId)).FirstOrDefault();
            if (vote == null) return null;
            return new ServiceVoteDto
            {
                Id = vote.Id,
                ServiceId = vote.ServiceId,
                UserId = vote.UserId,
                IsUpvote = vote.IsUpvote,
                CreatedAt = vote.CreatedAt
            };
        }

        public async Task<IEnumerable<ServiceDto>> GetServicesByOrganizationIdAsync(Guid organizationId)
        {
            var services = await _unitOfWork.ServiceRepository.FindAsync(s => s.OrganizationId == organizationId);
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

    }
}
