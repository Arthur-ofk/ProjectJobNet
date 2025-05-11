using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Role;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RoleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _unitOfWork.RoleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<RoleDto>>(roles);
        }

        public async Task<RoleDto> GetRoleByIdAsync(Guid id)
        {
            var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
            return _mapper.Map<RoleDto>(role);
        }

        public async Task AddRoleAsync(CreateRoleDto createRoleDto)
        {
            var role = _mapper.Map<Role>(createRoleDto);
            role.CreatedAt = DateTime.Now;
            role.UpdatedAt = DateTime.Now;

            await _unitOfWork.RoleRepository.AddAsync(role);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto)
        {
            var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
            if (role == null) return;

            _mapper.Map(updateRoleDto, role);
            role.UpdatedAt = DateTime.Now;

            _unitOfWork.RoleRepository.Update(role);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteRoleAsync(Guid id)
        {
            var role = await _unitOfWork.RoleRepository.GetByIdAsync(id);
            if (role == null) return;

            _unitOfWork.RoleRepository.Remove(role);
            await _unitOfWork.CompleteAsync();
        }
    }
}
