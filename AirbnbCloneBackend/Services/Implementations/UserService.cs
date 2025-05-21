using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using AirbnbCloneBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId)
        {
            return await _userRepository.GetUserPropertiesAsync(userId);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.DateRegistered = DateTime.Now;

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return user;
        }

        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}