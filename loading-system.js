// Loading System & Animations

(function() {
  
  // Create loading overlay
  function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      opacity: 1;
      transition: opacity 0.3s;
    `;

    overlay.innerHTML = `
      <div class="loading-spinner" style="
        width: 60px;
        height: 60px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #c2925e;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="
        margin-top: 20px;
        color: #666;
        font-size: 16px;
        font-weight: 500;
      ">Yuklanmoqda...</p>
    `;

    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return overlay;
  }

  // Show loading
  function showLoading(message = 'Yuklanmoqda...') {
    let overlay = document.getElementById('loadingOverlay');
    
    if (!overlay) {
      overlay = createLoadingOverlay();
      document.body.appendChild(overlay);
    }

    if (message) {
      const textEl = overlay.querySelector('p');
      if (textEl) textEl.textContent = message;
    }

    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
  }

  // Hide loading
  function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  }

  // Simulate page loading
  function simulatePageLoad() {
    showLoading();
    
    // Hide after content is loaded
    window.addEventListener('load', () => {
      setTimeout(hideLoading, 500);
    });
  }

  // Button loading state
  function setButtonLoading(button, loading, originalText) {
    if (loading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = `
        <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;"></span>
        Yuklanmoqda...
      `;
    } else {
      button.disabled = false;
      button.textContent = originalText || button.dataset.originalText || 'Tayyor';
    }
  }

  // Skeleton loading for products
  function createProductSkeleton() {
    return `
      <div class="product-skeleton" style="
        background: #f9f9f9;
        border-radius: 10px;
        padding: 15px;
        width: 220px;
        animation: pulse 1.5s ease-in-out infinite;
      ">
        <div style="width: 100%; height: 220px; background: #e0e0e0; border-radius: 8px; margin-bottom: 10px;"></div>
        <div style="width: 80%; height: 16px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
        <div style="width: 60%; height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
        <div style="width: 40%; height: 20px; background: #e0e0e0; border-radius: 4px;"></div>
      </div>
    `;
  }

  // Add pulse animation
  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(pulseStyle);

  // Show skeleton loaders
  function showProductSkeletons(container, count = 4) {
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.innerHTML += createProductSkeleton();
    }
  }

  // Progress bar
  function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #c2925e, #f4c542);
      z-index: 100000;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
  }

  // Update progress
  function setProgress(percent) {
    let progressBar = document.getElementById('progressBar');
    if (!progressBar) {
      progressBar = createProgressBar();
    }
    progressBar.style.width = percent + '%';
    
    if (percent >= 100) {
      setTimeout(() => {
        progressBar.style.opacity = '0';
        setTimeout(() => {
          if (progressBar.parentNode) {
            progressBar.parentNode.removeChild(progressBar);
          }
        }, 300);
      }, 500);
    }
  }

  // Smooth scroll with loading
  function smoothScrollTo(element, callback) {
    showLoading('Sahifa ochilmoqda...');
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      hideLoading();
      if (callback) callback();
    }, 800);
  }

  // Image lazy loading with placeholder
  function setupLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Toast notification with animation
  function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInUp 0.3s ease-out;
      max-width: 300px;
    `;
    toast.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from {
          transform: translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Initialize on page load
  function init() {
    // Show loading on page load
    simulatePageLoad();
    
    // Setup lazy loading
    setupLazyImages();
  }

  // Expose to global scope
  window.loadingSystem = {
    showLoading,
    hideLoading,
    setButtonLoading,
    showProductSkeletons,
    setProgress,
    smoothScrollTo,
    showToast
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();