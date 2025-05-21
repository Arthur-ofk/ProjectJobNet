using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Organization;
using BLL.Shared.Service;
using BLL.Shared.Job;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrganizationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrganizationDto>> GetAllOrganizationsAsync()
        {
            var orgs = await _unitOfWork.OrganizationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<OrganizationDto>>(orgs);
        }

        public async Task<OrganizationDto> GetOrganizationByIdAsync(Guid id)
        {
            var org = await _unitOfWork.OrganizationRepository.GetByIdAsync(id);
            return _mapper.Map<OrganizationDto>(org);
        }

        public async Task<IEnumerable<OrganizationDto>> GetOrganizationsByUserIdAsync(Guid userId)
        {
            var orgs = await _unitOfWork.OrganizationRepository.GetOrganizationsByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<OrganizationDto>>(orgs);
        }

        public async Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationDto dto)
        {
            var org = _mapper.Map<Organization>(dto);
            org.Id = Guid.NewGuid();
            org.CreatedAt = DateTime.UtcNow;
            org.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.OrganizationRepository.AddAsync(org);
            await _unitOfWork.CompleteAsync();

            // Add the creator as the Owner
            var orgUser = new OrganizationUser
            {
                UserId = dto.OwnerUserId,
                OrganizationId = org.Id,
                Role = "Owner",
                JoinedAt = DateTime.UtcNow
            };

            await _unitOfWork.OrganizationUserRepository.AddAsync(orgUser);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<OrganizationDto>(org);
        }

        public async Task UpdateOrganizationAsync(Guid id, UpdateOrganizationDto dto)
        {
            var org = await _unitOfWork.OrganizationRepository.GetByIdAsync(id);
            if (org == null) throw new ArgumentException($"Organization with ID {id} not found");

            _mapper.Map(dto, org);
            org.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.OrganizationRepository.Update(org);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteOrganizationAsync(Guid id)
        {
            var org = await _unitOfWork.OrganizationRepository.GetByIdAsync(id);
            if (org == null) throw new ArgumentException($"Organization with ID {id} not found");

            _unitOfWork.OrganizationRepository.Remove(org);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IEnumerable<OrganizationUserDto>> GetOrganizationMembersAsync(Guid organizationId)
        {
            var members = await _unitOfWork.OrganizationUserRepository.GetByOrganizationIdAsync(organizationId);
            return _mapper.Map<IEnumerable<OrganizationUserDto>>(members);
        }

        public async Task AddUserToOrganizationAsync(AddUserDto dto)
        {
            var organization = await _unitOfWork.OrganizationRepository.GetByIdAsync(dto.OrganizationId);
            if (organization == null)
                throw new ArgumentException("Organization not found");

            var user = await _unitOfWork.UserRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                throw new ArgumentException("User not found");

            var organizationUser = new OrganizationUser
            {
                UserId = dto.UserId,
                OrganizationId = dto.OrganizationId,
                Role = dto.Role,
                JoinedAt = DateTime.UtcNow
            };

            await _unitOfWork.OrganizationUserRepository.AddAsync(organizationUser);
            await _unitOfWork.CompleteAsync();
        }

        public async Task RemoveUserFromOrganizationAsync(Guid organizationId, Guid userId)
        {
            var member = await _unitOfWork.OrganizationUserRepository
                .GetByOrganizationAndUserIdAsync(organizationId, userId);

            if (member == null)
                throw new ArgumentException("User is not a member of this organization");

            // Don't allow removing the owner
            if (member.Role == "Owner")
                throw new InvalidOperationException("Cannot remove the owner from the organization");

            _unitOfWork.OrganizationUserRepository.Remove(member);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<OrganizationUserDto> UpdateUserRoleAsync(Guid organizationId, Guid userId, string role)
        {
            var member = await _unitOfWork.OrganizationUserRepository
                .GetByOrganizationAndUserIdAsync(organizationId, userId);

            if (member == null)
                throw new ArgumentException("User is not a member of this organization");

            // Don't allow changing the owner's role
            if (member.Role == "Owner" && role != "Owner")
                throw new InvalidOperationException("Cannot change the owner's role");

            member.Role = role;
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<OrganizationUserDto>(member);
        }

        public async Task<bool> IsOwnerAsync(Guid organizationId, Guid userId)
        {
            var organization = await _unitOfWork.OrganizationRepository.GetByIdAsync(organizationId);
            return organization != null && organization.OwnerUserId == userId;
        }

        public async Task<OrganizationDetailsDto> GetOrganizationDetailsAsync(Guid organizationId)
        {
            var organization = await _unitOfWork.OrganizationRepository.GetByIdAsync(organizationId);
            if (organization == null)
                return null;

            var services = await _unitOfWork.ServiceRepository.GetServicesByOrganizationIdAsync(organizationId);
            var jobs = await _unitOfWork.JobRepository.GetJobsByOrganizationIdAsync(organizationId);

            return new OrganizationDetailsDto
            {
                Id = organization.Id,
                Name = organization.Name,
                Description = organization.Description,
                OwnerUserId = organization.OwnerUserId,
                Services = _mapper.Map<List<ServiceDto>>(services),
                Jobs = _mapper.Map<List<JobDto>>(jobs)
            };
        }
    }
}
