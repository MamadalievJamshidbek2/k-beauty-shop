// Wishlist System

(function() {
  const WISHLIST_STORAGE_KEY = 'myshop_wishlist_v1';

  // Get wishlist from storage
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  // Save wishlist to storage
  function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }

  // Check if product is in wishlist
  function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
  }

  // Add to wishlist
  function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      saveWishlist(wishlist);
      return true;
    }
    return false;
  }

  // Remove from wishlist
  function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist(wishlist);
  }

  // Toggle wishlist
  function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  }

  // Setup wishlist button on product detail page
  function setupWishlistButton() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (!wishlistBtn) return;

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')) || 1;

    // Set initial state
    if (isInWishlist(productId)) {
      wishlistBtn.classList.add('active');
      wishlistBtn.innerHTML = '❤️';
    }

    // Handle click
    wishlistBtn.addEventListener('click', () => {
      const added = toggleWishlist(productId);
      
      if (added) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '❤️';
        showNotification('Sevimlilarga qo\'shildi!', 'success');
      } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '❤';
        showNotification('Sevimlilardan o\'chirildi', 'info');
      }
    });
  }

  // Setup wishlist buttons on product cards (for listing pages)
  function setupProductCardWishlists() {
    document.body.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('.product-wishlist-btn');
      if (!wishlistBtn) return;

      const productCard = wishlistBtn.closest('.product');
      if (!productCard) return;

      const productId = parseInt(productCard.dataset.productId);
      if (!productId) return;

      const added = toggleWishlist(productId);
      
      if (added) {
        wishlistBtn.innerHTML = '❤️';
        wishlistBtn.classList.add('active');
      } else {
        wishlistBtn.innerHTML = '❤';
        wishlistBtn.classList.remove('active');
      }
    });
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
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
    }, 2000);
  }

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize
  function init() {
    setupWishlistButton();
    setupProductCardWishlists();
  }

  // Expose to global scope
  window.wishlistSystem = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();