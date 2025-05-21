using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AirbnbDbContext context) : base(context)
        {
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId)
        {
            return await _context.Properties
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .Where(p => p.HostID == userId)
                .ToListAsync();
        }
    }
}