using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using AirbnbCloneBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<IEnumerable<Review>> GetReviewsByPropertyAsync(int propertyId)
        {
            return await _reviewRepository.GetReviewsByPropertyAsync(propertyId);
        }

        public async Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId)
        {
            return await _reviewRepository.GetReviewsByUserAsync(userId);
        }

        public async Task<Review> CreateReviewAsync(Review review)
        {
            review.ReviewDate = DateTime.Now;

            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveChangesAsync();

            return review;
        }

        public async Task UpdateReviewAsync(Review review)
        {
            await _reviewRepository.UpdateAsync(review);
            await _reviewRepository.SaveChangesAsync();
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review != null)
            {
                await _reviewRepository.DeleteAsync(review);
                await _reviewRepository.SaveChangesAsync();
            }
        }
    }
}