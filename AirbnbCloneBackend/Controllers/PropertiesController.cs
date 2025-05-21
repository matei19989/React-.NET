using Microsoft.AspNetCore.Mvc;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Services.Interfaces;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Controllers
{
    public class PropertiesController : Controller
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // GET: Properties
        public async Task<IActionResult> Index()
        {
            var properties = await _propertyService.GetAllPropertiesAsync();
            return View(properties);
        }

        // GET: Properties/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var property = await _propertyService.GetPropertyByIdAsync(id.Value);

            if (property == null)
            {
                return NotFound();
            }

            return View(property);
        }

        // GET: Properties/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Properties/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Property property)
        {
            if (ModelState.IsValid)
            {
                await _propertyService.CreatePropertyAsync(property);
                return RedirectToAction(nameof(Index));
            }
            return View(property);
        }

        // GET: Properties/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var property = await _propertyService.GetPropertyByIdAsync(id.Value);
            if (property == null)
            {
                return NotFound();
            }

            return View(property);
        }

        // POST: Properties/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Property property)
        {
            if (id != property.PropertyID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                await _propertyService.UpdatePropertyAsync(property);
                return RedirectToAction(nameof(Index));
            }

            return View(property);
        }

        // GET: Properties/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var property = await _propertyService.GetPropertyByIdAsync(id.Value);
            if (property == null)
            {
                return NotFound();
            }

            return View(property);
        }

        // POST: Properties/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _propertyService.DeletePropertyAsync(id);
            return RedirectToAction(nameof(Index));
        }
    }
}