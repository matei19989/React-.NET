using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<Property>> GetAllPropertiesAsync();
        Task<Property> GetPropertyByIdAsync(int id);
        Task<IEnumerable<Property>> SearchPropertiesAsync(string location, int? guests, decimal? minPrice, decimal? maxPrice);
        Task<IEnumerable<Property>> GetPropertiesByHostAsync(int hostId);
        Task<Property> CreatePropertyAsync(Property property);
        Task UpdatePropertyAsync(Property property);
        Task DeletePropertyAsync(int id);
    }
}