using Microsoft.AspNetCore.Mvc;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiPropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public ApiPropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // GET: api/ApiProperties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
        {
            var properties = await _propertyService.GetAllPropertiesAsync();
            return Ok(properties);
        }

        // GET: api/ApiProperties/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);

            if (property == null)
            {
                return NotFound();
            }

            return Ok(property);
        }

        // GET: api/ApiProperties/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Property>>> SearchProperties(
            [FromQuery] string location,
            [FromQuery] int? guests,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var properties = await _propertyService.SearchPropertiesAsync(
                location, guests, minPrice, maxPrice);

            return Ok(properties);
        }

        // GET: api/ApiProperties/host/{hostId}
        [HttpGet("host/{hostId}")]
        public async Task<ActionResult<IEnumerable<Property>>> GetPropertiesByHost(int hostId)
        {
            var properties = await _propertyService.GetPropertiesByHostAsync(hostId);
            return Ok(properties);
        }

        // POST: api/ApiProperties
        [HttpPost]
        public async Task<ActionResult<Property>> CreateProperty(Property property)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdProperty = await _propertyService.CreatePropertyAsync(property);

            return CreatedAtAction(
                nameof(GetProperty),
                new { id = createdProperty.PropertyID },
                createdProperty);
        }

        // PUT: api/ApiProperties/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProperty(int id, Property property)
        {
            if (id != property.PropertyID)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _propertyService.UpdatePropertyAsync(property);
            }
            catch
            {
                if (await _propertyService.GetPropertyByIdAsync(id) == null)
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/ApiProperties/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            await _propertyService.DeletePropertyAsync(id);
            return NoContent();
        }
    }
}