using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId);
    }
}