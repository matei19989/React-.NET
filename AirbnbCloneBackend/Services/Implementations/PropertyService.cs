using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using AirbnbCloneBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Implementations
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;

        public PropertyService(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
        {
            return await _propertyRepository.GetPropertiesWithDetailsAsync();
        }

        public async Task<Property> GetPropertyByIdAsync(int id)
        {
            return await _propertyRepository.GetPropertyWithDetailsAsync(id);
        }

        public async Task<IEnumerable<Property>> SearchPropertiesAsync(string location, int? guests, decimal? minPrice, decimal? maxPrice)
        {
            return await _propertyRepository.SearchPropertiesAsync(location, guests, minPrice, maxPrice);
        }

        public async Task<IEnumerable<Property>> GetPropertiesByHostAsync(int hostId)
        {
            return await _propertyRepository.FindAsync(p => p.HostID == hostId);
        }

        public async Task<Property> CreatePropertyAsync(Property property)
        {
            property.DateListed = DateTime.Now;
            property.IsActive = true;

            await _propertyRepository.AddAsync(property);
            await _propertyRepository.SaveChangesAsync();

            return property;
        }

        public async Task UpdatePropertyAsync(Property property)
        {
            await _propertyRepository.UpdateAsync(property);
            await _propertyRepository.SaveChangesAsync();
        }

        public async Task DeletePropertyAsync(int id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property != null)
            {
                // Soft delete - just mark as inactive
                property.IsActive = false;
                await _propertyRepository.UpdateAsync(property);
                await _propertyRepository.SaveChangesAsync();
            }
        }
    }
}