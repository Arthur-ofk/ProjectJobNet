using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.SubscriptionPlan;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class SubscriptionPlanService : ISubscriptionPlanService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SubscriptionPlanService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubscriptionPlanDto>> GetAllSubscriptionPlansAsync()
        {
            var plans = await _unitOfWork.SubscriptionPlanRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SubscriptionPlanDto>>(plans);
        }

        public async Task<SubscriptionPlanDto> GetSubscriptionPlanByIdAsync(Guid id)
        {
            var plan = await _unitOfWork.SubscriptionPlanRepository.GetByIdAsync(id);
            return _mapper.Map<SubscriptionPlanDto>(plan);
        }

        public async Task AddSubscriptionPlanAsync(CreateSubscriptionPlanDto createSubscriptionPlanDto)
        {
            var plan = _mapper.Map<SubscriptionPlan>(createSubscriptionPlanDto);
            plan.CreatedAt = DateTime.Now;
            plan.UpdatedAt = DateTime.Now;

            await _unitOfWork.SubscriptionPlanRepository.AddAsync(plan);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateSubscriptionPlanAsync(Guid id, CreateSubscriptionPlanDto updateSubscriptionPlanDto)
        {
            var plan = await _unitOfWork.SubscriptionPlanRepository.GetByIdAsync(id);
            if (plan == null) return;

            _mapper.Map(updateSubscriptionPlanDto, plan);
            plan.UpdatedAt = DateTime.Now;

            _unitOfWork.SubscriptionPlanRepository.Update(plan);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteSubscriptionPlanAsync(Guid id)
        {
            var plan = await _unitOfWork.SubscriptionPlanRepository.GetByIdAsync(id);
            if (plan == null) return;

            _unitOfWork.SubscriptionPlanRepository.Remove(plan);
            await _unitOfWork.CompleteAsync();
        }
    }
}
