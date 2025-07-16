// Shared Reviews System for FreshCart
let reviews = {};

// Initialize reviews data
function initializeReviews() {
  const savedReviews = localStorage.getItem('productReviews');
  if (savedReviews) {
    reviews = JSON.parse(savedReviews);
  } else {
    // Default reviews for products
    reviews = {
      'Milk': [
        { user: 'Sarah M.', rating: 5, comment: 'Fresh and creamy! Perfect for my morning coffee.', date: '2024-01-15' },
        { user: 'John D.', rating: 4, comment: 'Good quality milk, delivered fresh.', date: '2024-01-10' },
        { user: 'Lisa K.', rating: 5, comment: 'Excellent taste and freshness.', date: '2024-01-08' }
      ],
      'Eggs': [
        { user: 'Mike R.', rating: 5, comment: 'Farm fresh eggs! Yolks are bright orange.', date: '2024-01-14' },
        { user: 'Emma W.', rating: 4, comment: 'Great for baking, good quality.', date: '2024-01-12' }
      ],
      'Bread': [
        { user: 'David L.', rating: 4, comment: 'Soft and fresh bread, perfect for sandwiches.', date: '2024-01-13' },
        { user: 'Anna B.', rating: 5, comment: 'Delicious whole wheat bread!', date: '2024-01-11' }
      ],
      'Cheese': [
        { user: 'Tom H.', rating: 5, comment: 'Premium cheddar, melts perfectly!', date: '2024-01-16' },
        { user: 'Rachel G.', rating: 4, comment: 'Good quality cheese for cooking.', date: '2024-01-09' }
      ],
      'Apples': [
        { user: 'Chris P.', rating: 5, comment: 'Crisp and juicy apples!', date: '2024-01-15' },
        { user: 'Maria S.', rating: 4, comment: 'Sweet and fresh, great for snacking.', date: '2024-01-12' }
      ],
      'Bananas': [
        { user: 'Kevin M.', rating: 5, comment: 'Perfect ripeness, great price!', date: '2024-01-14' },
        { user: 'Jennifer L.', rating: 4, comment: 'Good quality bananas.', date: '2024-01-10' }
      ],
      'Yogurt': [
        { user: 'Alex T.', rating: 4, comment: 'Creamy and delicious yogurt.', date: '2024-01-13' },
        { user: 'Sophie M.', rating: 5, comment: 'Perfect for smoothies and breakfast.', date: '2024-01-11' }
      ],
      'Butter': [
        { user: 'Robert K.', rating: 5, comment: 'Rich and creamy butter, great for baking.', date: '2024-01-16' },
        { user: 'Emily D.', rating: 4, comment: 'Good quality butter.', date: '2024-01-09' }
      ],
      'Cream': [
        { user: 'Daniel W.', rating: 4, comment: 'Fresh cream, perfect for coffee.', date: '2024-01-14' },
        { user: 'Jessica L.', rating: 5, comment: 'Excellent quality cream.', date: '2024-01-12' }
      ]
    };
    saveReviews();
  }
}

// Save reviews to localStorage
function saveReviews() {
  localStorage.setItem('productReviews', JSON.stringify(reviews));
}

// Get average rating for a product
function getAverageRating(productName) {
  if (!reviews[productName] || reviews[productName].length === 0) {
    return 0;
  }
  const total = reviews[productName].reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews[productName].length).toFixed(1);
}

// Get review count for a product
function getReviewCount(productName) {
  return reviews[productName] ? reviews[productName].length : 0;
}

// Add a new review
function addReview(productName, rating, comment) {
  if (!reviews[productName]) {
    reviews[productName] = [];
  }
  
  const newReview = {
    user: 'You',
    rating: rating,
    comment: comment,
    date: new Date().toISOString().split('T')[0]
  };
  
  reviews[productName].unshift(newReview);
  saveReviews();
  
  // Update review display if on product detail page
  if (window.location.pathname.includes('product-detail.html')) {
    updateReviewDisplay();
  }
  
  showNotification('Review added successfully!');
}

// Function to show reviews modal
function showReviewsModal(productName) {
  const productReviews = reviews[productName] || [];
  const averageRating = getAverageRating(productName);
  const reviewCount = getReviewCount(productName);
  
  let reviewsHTML = '';
  if (productReviews.length > 0) {
    reviewsHTML = productReviews.map(review => `
      <div class="border-b border-gray-200 pb-3 mb-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="flex text-yellow-500">
              ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
            </div>
            <span class="font-medium text-sm">${review.user}</span>
          </div>
          <span class="text-xs text-gray-500">${review.date}</span>
        </div>
        <p class="text-sm text-gray-600">${review.comment}</p>
      </div>
    `).join('');
  } else {
    reviewsHTML = '<p class="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>';
  }
  
  const modalHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-[#1b0e0e]">Reviews for ${productName}</h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex text-yellow-500 text-2xl">
              ${'★'.repeat(Math.floor(averageRating))}${averageRating % 1 >= 0.5 ? '☆' : ''}${'☆'.repeat(5-Math.floor(averageRating)-(averageRating % 1 >= 0.5 ? 1 : 0))}
            </div>
            <div>
              <div class="font-semibold">${averageRating} out of 5</div>
              <div class="text-sm text-gray-600">${reviewCount} review${reviewCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          ${reviewsHTML}
        </div>
        <div class="mt-6 pt-4 border-t border-gray-200">
          <button onclick="closeModal(); showAddReviewModal('${productName}')" class="w-full bg-[#994d51] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a3d41] transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Function to show add review modal
function showAddReviewModal(productName) {
  const modalHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-[#1b0e0e]">Write a Review</h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div class="flex gap-2" id="rating-stars">
              <button onclick="setRating(1)" class="text-2xl text-gray-300 hover:text-yellow-500" data-rating="1">★</button>
              <button onclick="setRating(2)" class="text-2xl text-gray-300 hover:text-yellow-500" data-rating="2">★</button>
              <button onclick="setRating(3)" class="text-2xl text-gray-300 hover:text-yellow-500" data-rating="3">★</button>
              <button onclick="setRating(4)" class="text-2xl text-gray-300 hover:text-yellow-500" data-rating="4">★</button>
              <button onclick="setRating(5)" class="text-2xl text-gray-300 hover:text-yellow-500" data-rating="5">★</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea id="review-comment" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#994d51] focus:border-transparent" placeholder="Share your experience with this product..."></textarea>
          </div>
          <div class="flex gap-3">
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button onclick="submitReview('${productName}')" class="flex-1 bg-[#994d51] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a3d41] transition-colors">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Function to set rating stars
function setRating(rating) {
  const stars = document.querySelectorAll('#rating-stars button');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove('text-gray-300');
      star.classList.add('text-yellow-500');
    } else {
      star.classList.remove('text-yellow-500');
      star.classList.add('text-gray-300');
    }
  });
  window.selectedRating = rating;
}

// Function to submit review
function submitReview(productName) {
  const rating = window.selectedRating || 0;
  const comment = document.getElementById('review-comment').value.trim();
  
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }
  
  if (comment === '') {
    alert('Please write a comment');
    return;
  }
  
  addReview(productName, rating, comment);
  closeModal();
  
  // Update the rating display on the page
  updateProductRatingDisplay(productName);
}

// Function to close modal
function closeModal() {
  const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
  if (modal) {
    modal.remove();
  }
}

// Function to update product rating display
function updateProductRatingDisplay(productName) {
  const ratingElement = document.getElementById(`${productName.toLowerCase()}-rating`);
  if (ratingElement) {
    const avgRating = getAverageRating(productName);
    const reviewCount = getReviewCount(productName);
    ratingElement.textContent = avgRating;
    ratingElement.nextElementSibling.textContent = `(${reviewCount})`;
  }
}

// Function to update all product ratings
function updateAllProductRatings() {
  const products = ['Milk', 'Eggs', 'Bread', 'Cheese', 'Butter', 'Apples', 'Bananas', 'Strawberries', 'Blueberries', 'Avocados', 'Yogurt', 'Cream'];
  products.forEach(product => {
    updateProductRatingDisplay(product);
  });
}

// Function to show notification (if not already defined)
function showNotification(message) {
  if (typeof window.showNotification === 'function') {
    window.showNotification(message);
  } else {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}

// Initialize reviews when script loads
document.addEventListener('DOMContentLoaded', function() {
  initializeReviews();
}); 