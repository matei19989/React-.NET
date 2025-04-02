using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiPropertiesController : ControllerBase
    {
        private readonly AirbnbDbContext _context;

        public ApiPropertiesController(AirbnbDbContext context)
        {
            _context = context;
        }

        // GET: api/ApiProperties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
        {
            var properties = await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .ToListAsync();

            return properties;
        }

        // GET: api/ApiProperties/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .FirstOrDefaultAsync(m => m.PropertyID == id);

            if (property == null)
            {
                return NotFound();
            }

            return property;
        }
    }
}