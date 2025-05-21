using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
    }
}