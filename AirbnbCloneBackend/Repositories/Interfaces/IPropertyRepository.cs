using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Interfaces
{
    public interface IPropertyRepository : IGenericRepository<Property>
    {
        Task<IEnumerable<Property>> GetPropertiesWithDetailsAsync();
        Task<Property> GetPropertyWithDetailsAsync(int id);
        Task<IEnumerable<Property>> SearchPropertiesAsync(string location, int? guests, decimal? minPrice, decimal? maxPrice);
    }
}