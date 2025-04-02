using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Controllers
{
    public class PropertiesController : Controller
    {
        private readonly AirbnbDbContext _context;

        public PropertiesController(AirbnbDbContext context)
        {
            _context = context;
        }

        // GET: Properties
        public async Task<IActionResult> Index()
        {
            var properties = await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .ToListAsync();
            return View(properties);
        }

        // GET: Properties/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var property = await _context.Properties
                .Include(p => p.Host)
                .Include(p => p.Location)
                .Include(p => p.PropertyImages)
                .FirstOrDefaultAsync(m => m.PropertyID == id);

            if (property == null)
            {
                return NotFound();
            }

            return View(property);
        }
    }
}