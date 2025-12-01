// Reviews System

(function() {
  const REVIEWS_STORAGE_KEY = 'myshop_reviews_v1';
  let currentProductId = null;
  let selectedRating = 0;

  // Get product ID from URL
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
  }

  // Get all reviews from storage
  function getAllReviews() {
    try {
      return JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  // Get reviews for specific product
  function getProductReviews(productId) {
    const allReviews = getAllReviews();
    return allReviews[productId] || [];
  }

  // Save review
  function saveReview(productId, review) {
    const allReviews = getAllReviews();
    if (!allReviews[productId]) {
      allReviews[productId] = [];
    }
    allReviews[productId].unshift(review); // Add to beginning
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));
  }

  // Load and render reviews
  function loadReviews() {
    currentProductId = getProductId();
    const reviews = getProductReviews(currentProductId);
    
    const reviewsList = document.getElementById('reviewsList');
    const reviewCount = document.getElementById('reviewCount');
    
    if (!reviewsList) return;

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <p style="font-size: 18px; margin-bottom: 10px;">Hali sharhlar yo'q</p>
          <p>Birinchi bo'lib sharh qoldiring!</p>
        </div>
      `;
      if (reviewCount) reviewCount.textContent = '(0 sharhlar)';
      return;
    }

    if (reviewCount) {
      reviewCount.textContent = `(${reviews.length} ${reviews.length === 1 ? 'sharh' : 'sharhlar'})`;
    }

    reviewsList.innerHTML = '';
    reviews.forEach(review => {
      const reviewEl = createReviewElement(review);
      reviewsList.appendChild(reviewEl);
    });

    // Update average rating
    updateAverageRating(reviews);
  }

  // Create review element
  function createReviewElement(review) {
    const div = document.createElement('div');
    div.className = 'review-item';
    
    const stars = '⭐'.repeat(review.rating);
    const initials = review.userName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    div.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${initials}</div>
          <div>
            <div class="reviewer-name">${review.userName}</div>
            <div class="review-date">${review.date}</div>
          </div>
        </div>
        <div class="review-stars">${stars}</div>
      </div>
      <p class="review-text">${review.text}</p>
    `;
    
    return div;
  }

  // Update average rating
  function updateAverageRating(reviews) {
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);
    
    const starsEl = document.getElementById('productStars');
    if (starsEl) {
      const fullStars = Math.floor(avgRating);
      starsEl.textContent = '⭐'.repeat(fullStars);
    }
  }

  // Setup review modal
  function setupReviewModal() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    const ratingInput = document.getElementById('ratingInput');

    if (!writeReviewBtn || !reviewModal) return;

    // Open modal
    writeReviewBtn.addEventListener('click', () => {
      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Sharh qoldirish uchun tizimga kiring!');
        return;
      }

      reviewModal.classList.add('active');
      selectedRating = 0;
      updateRatingStars();
    });

    // Close modal
    cancelReview.addEventListener('click', () => {
      reviewModal.classList.remove('active');
      reviewForm.reset();
      selectedRating = 0;
      updateRatingStars();
    });

    // Rating stars
    ratingInput.querySelectorAll('span').forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        updateRatingStars();
      });

      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        highlightStars(rating);
      });
    });

    ratingInput.addEventListener('mouseleave', () => {
      updateRatingStars();
    });

    // Submit review
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (selectedRating === 0) {
        alert('Iltimos, reyting tanlang!');
        return;
      }

      const reviewText = document.getElementById('reviewText').value.trim();
      if (!reviewText) {
        alert('Iltimos, sharh yozing!');
        return;
      }

      // Get current user
      const currentUser = localStorage.getItem('currentUser') || 'Foydalanuvchi';

      // Create review
      const review = {
        userName: currentUser,
        rating: selectedRating,
        text: reviewText,
        date: new Date().toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      // Save review
      saveReview(currentProductId, review);

      // Close modal and reload reviews
      reviewModal.classList.remove('active');
      reviewForm.reset();
      selectedRating = 0;
      loadReviews();

      // Show success message
      showNotification('Rahmat! Sharhingiz qo\'shildi!', 'success');
    });
  }

  // Update rating stars display
  function updateRatingStars() {
    const stars = document.querySelectorAll('#ratingInput span');
    stars.forEach((star, index) => {
      if (index < selectedRating) {
        star.textContent = '★';
        star.classList.add('active');
      } else {
        star.textContent = '☆';
        star.classList.remove('active');
      }
    });
  }

  // Highlight stars on hover
  function highlightStars(rating) {
    const stars = document.querySelectorAll('#ratingInput span');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.textContent = '★';
      } else {
        star.textContent = '☆';
      }
    });
  }

  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize with sample reviews if empty
  function initSampleReviews() {
    const allReviews = getAllReviews();
    if (Object.keys(allReviews).length === 0) {
      // Add sample reviews for first few products
      const sampleReviews = {
        1: [
          {
            userName: 'Aziza Karimova',
            rating: 5,
            text: 'Juda yoqimli hid! Uzoq muddatga saqlanadi. Tavsiya qilaman!',
            date: '2024-11-15'
          },
          {
            userName: 'Jahongir Tursunov',
            rating: 4,
            text: 'Yaxshi mahsulot, lekin narxi biroz qimmat.',
            date: '2024-11-10'
          }
        ],
        2: [
          {
            userName: 'Dilnoza Ahmadova',
            rating: 5,
            text: 'Zo\'r parfyum! Barcha do\'stlarim so\'rashadi qanday hid ishlatayotganimni.',
            date: '2024-11-20'
          }
        ]
      };
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(sampleReviews));
    }
  }

  // Initialize
  function init() {
    initSampleReviews();
    loadReviews();
    setupReviewModal();
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();