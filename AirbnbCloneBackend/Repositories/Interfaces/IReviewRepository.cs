using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetReviewsByPropertyAsync(int propertyId);
        Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId);
    }
}