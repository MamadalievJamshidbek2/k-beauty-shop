// Products Loader - Load from Backend API

(function() {

  let allProducts = [];

  // Load products from backend
  async function loadProductsFromBackend() {
    try {
      console.log('🔄 Loading products from backend...');

      if (window.loadingSystem) {
        window.loadingSystem.showLoading('Mahsulotlar yuklanmoqda...');
      }

      // Check if API is available
      if (!window.API || !window.API.Products) {
        console.warn('⚠️ API not available, using local data');
        if (window.loadingSystem) window.loadingSystem.hideLoading();
        return window.ALL_PRODUCTS || [];
      }

      const result = await window.API.Products.getAll();

      if (window.loadingSystem) {
        window.loadingSystem.hideLoading();
      }

      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Loaded products from backend:', result.data.length);
        allProducts = result.data;
        return allProducts;
      } else {
        console.warn('⚠️ Backend returned empty, using local data');
        allProducts = window.ALL_PRODUCTS || [];
        return allProducts;
      }
    } catch (error) {
      console.error('❌ Error loading products from backend:', error);
      
      if (window.loadingSystem) {
        window.loadingSystem.hideLoading();
      }

      // Show user-friendly message
      if (window.loadingSystem) {
        window.loadingSystem.showToast(
          'Server bilan bog\'lanishda xatolik. Local ma\'lumotlar ko\'rsatilmoqda.',
          'info'
        );
      }

      // Fallback to local data
      allProducts = window.ALL_PRODUCTS || [];
      return allProducts;
    }
  }

  // Render products in container
  function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Mahsulotlar topilmadi</p>';
      return;
    }

    products.forEach(product => {
      const productEl = createProductCard(product);
      container.appendChild(productEl);
    });

    // Inject add to cart buttons
    if (window.injectAddButtons) {
      window.injectAddButtons();
    }
  }

  // Create product card element
  function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.productId = product.id;
    div.dataset.name = product.name;
    div.dataset.price = product.price;
    div.dataset.img = product.imageUrl || product.img || 'images/placeholder.jpg';
    
    // Calculate rating stars
    const rating = product.rating || 4.5;
    const stars = '⭐'.repeat(Math.floor(rating));

    // Price HTML
    let priceHTML = `<p class="price">$${product.price}`;
    if (product.oldPrice) {
      priceHTML += ` <span class="old-price">$${product.oldPrice}</span>`;
      const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      priceHTML += ` <span class="discount">-${discount}%</span>`;
    }
    priceHTML += `</p>`;

    div.innerHTML = `
      <img src="${product.imageUrl || product.img || 'images/placeholder.jpg'}" 
           alt="${product.name}"
           onerror="this.src='images/placeholder.jpg'">
      <h3>${product.name}</h3>
      <div class="rating">${stars} ${rating}/5</div>
      ${priceHTML}
    `;

    return div;
  }

  // Initialize products on page
  async function initProducts() {
    const products = await loadProductsFromBackend();

    // Render on different pages
    const newArrivalsContainer = document.getElementById('newArrivalsProducts');
    const topSellingContainer = document.getElementById('topSellingProducts');
    const searchResultsContainer = document.getElementById('searchResults');

    if (newArrivalsContainer) {
      const newProducts = products.slice(0, 4);
      renderProducts(newProducts, 'newArrivalsProducts');
    }

    if (topSellingContainer) {
      const topProducts = products.slice(4, 8);
      renderProducts(topProducts, 'topSellingProducts');
    }

    if (searchResultsContainer) {
      renderProducts(products, 'searchResults');
    }

    // Store globally for search/filter
    window.ALL_PRODUCTS_BACKEND = products;
  }

  // Load single product for detail page
  async function loadProductDetail(productId) {
    try {
      if (window.loadingSystem) {
        window.loadingSystem.showLoading('Mahsulot yuklanmoqda...');
      }

      const result = await window.API.Products.getById(productId);

      if (window.loadingSystem) {
        window.loadingSystem.hideLoading();
      }

      if (result.success) {
        return result.data;
      } else {
        // Fallback to local data
        return window.ALL_PRODUCTS?.find(p => p.id == productId);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      if (window.loadingSystem) {
        window.loadingSystem.hideLoading();
      }
      return window.ALL_PRODUCTS?.find(p => p.id == productId);
    }
  }

  // Search products
  function searchProducts(query) {
    const products = window.ALL_PRODUCTS_BACKEND || window.ALL_PRODUCTS || [];
    
    if (!query || query.trim() === '') {
      return products;
    }

    query = query.toLowerCase().trim();
    
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = (product.description || '').toLowerCase().includes(query);
      const categoryMatch = (product.category || '').toLowerCase().includes(query);
      
      return nameMatch || descMatch || categoryMatch;
    });
  }

  // Filter by price
  function filterByPrice(products, min, max) {
    if (min === 'all') return products;
    return products.filter(p => p.price >= min && p.price <= max);
  }

  // Sort products
  function sortProducts(products, sortType) {
    const sorted = [...products];
    
    switch(sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  // Expose to global
  window.productsLoader = {
    loadAll: loadProductsFromBackend,
    loadDetail: loadProductDetail,
    renderProducts,
    searchProducts,
    filterByPrice,
    sortProducts,
    getAllProducts: () => window.ALL_PRODUCTS_BACKEND || window.ALL_PRODUCTS || []
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
  } else {
    initProducts();
  }

})();