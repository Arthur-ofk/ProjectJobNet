using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Subscription;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SubscriptionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubscriptionDto>> GetAllSubscriptionsAsync()
        {
            var subscriptions = await _unitOfWork.SubscriptionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
        }

        public async Task<SubscriptionDto> GetSubscriptionByIdAsync(Guid id)
        {
            var subscription = await _unitOfWork.SubscriptionRepository.GetByIdAsync(id);
            return _mapper.Map<SubscriptionDto>(subscription);
        }

        public async Task AddSubscriptionAsync(CreateSubscriptionDto createSubscriptionDto)
        {
            var subscription = _mapper.Map<Subscription>(createSubscriptionDto);
            subscription.IsActive = true;
            subscription.IsExpired = false;

            await _unitOfWork.SubscriptionRepository.AddAsync(subscription);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateSubscriptionAsync(Guid id, CreateSubscriptionDto updateSubscriptionDto)
        {
            var subscription = await _unitOfWork.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null) return;

            _mapper.Map(updateSubscriptionDto, subscription);
           

            _unitOfWork.SubscriptionRepository.Update(subscription);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteSubscriptionAsync(Guid id)
        {
            var subscription = await _unitOfWork.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null) return;

            _unitOfWork.SubscriptionRepository.Remove(subscription);
            await _unitOfWork.CompleteAsync();
        }
    }
}
