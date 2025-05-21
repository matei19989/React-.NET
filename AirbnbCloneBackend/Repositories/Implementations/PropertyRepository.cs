using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Implementations
{
    public class PropertyRepository : GenericRepository<Property>, IPropertyRepository
    {
        public PropertyRepository(AirbnbDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Property>> GetPropertiesWithDetailsAsync()
        {
            return await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .Include(p => p.Availabilities)
                .Where(p => p.IsActive)
                .ToListAsync();
        }

        public async Task<Property> GetPropertyWithDetailsAsync(int id)
        {
            return await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .Include(p => p.Availabilities)
                .FirstOrDefaultAsync(p => p.PropertyID == id);
        }

        public async Task<IEnumerable<Property>> SearchPropertiesAsync(string location, int? guests, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .Where(p => p.IsActive);

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(p =>
                    p.Location.City.Contains(location) ||
                    p.Location.State.Contains(location) ||
                    p.Location.Country.Contains(location) ||
                    p.Location.Address.Contains(location));
            }

            if (guests.HasValue)
            {
                query = query.Where(p => p.MaxGuests >= guests.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.PricePerNight >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.PricePerNight <= maxPrice.Value);
            }

            return await query.ToListAsync();
        }
    }
}