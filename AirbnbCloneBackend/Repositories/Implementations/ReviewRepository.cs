using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Implementations
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(AirbnbDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Review>> GetReviewsByPropertyAsync(int propertyId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.PropertyID == propertyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId)
        {
            return await _context.Reviews
                .Include(r => r.Property)
                .Where(r => r.UserID == userId)
                .ToListAsync();
        }
    }
}