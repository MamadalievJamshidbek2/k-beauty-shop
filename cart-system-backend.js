// Cart System with Backend API

(function() {
  const CART_STORAGE_KEY = 'myshop_cart_v1';
  let cart = [];
  let isBackendSync = false;

  // Get user ID
  function getUserId() {
    return window.API?.getCurrentUserId() || null;
  }

  // Check if user is logged in
  function isLoggedIn() {
    return getUserId() !== null;
  }

  // Load cart (from backend or localStorage)
  async function loadCart() {
    const userId = getUserId();

    if (userId && window.API) {
      // Load from backend
      try {
        const result = await window.API.Cart.get(userId);
        if (result.success) {
          cart = result.data.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product?.name || 'Product',
            price: item.product?.price || 0,
            img: item.product?.imageUrl || 'images/placeholder.jpg',
            qty: item.quantity
          }));
          isBackendSync = true;
          saveToLocalStorage();
          return cart;
        }
      } catch (error) {
        console.error('Error loading cart from backend:', error);
      }
    }

    // Fallback to localStorage
    try {
      cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
      cart = [];
    }
    
    return cart;
  }

  // Save to localStorage (backup)
  function saveToLocalStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  // Add item to cart
  async function addToCart(product) {
    const userId = getUserId();

    if (userId && window.API) {
      // Add via backend
      try {
        const result = await window.API.Cart.addItem(
          userId,
          product.productId || product.id,
          1
        );

        if (result.success) {
          await loadCart(); // Reload cart from backend
          showNotification('Savatchaga qo\'shildi!', 'success');
          renderCartItems();
          return true;
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Xatolik yuz berdi!', 'error');
        return false;
      }
    }

    // Fallback to localStorage
    const existingIndex = cart.findIndex(item => 
      (item.productId || item.id) === (product.productId || product.id)
    );

    if (existingIndex >= 0) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        productId: product.productId || product.id,
        name: product.name,
        price: product.price,
        img: product.img || product.imageUrl,
        qty: 1
      });
    }

    saveToLocalStorage();
    renderCartItems();
    showNotification('Savatchaga qo\'shildi!', 'success');
    return true;
  }

  // Update quantity
  async function updateQuantity(index, newQty) {
    if (index < 0 || index >= cart.length) return;
    
    const item = cart[index];
    const userId = getUserId();

    if (userId && window.API && item.id) {
      // Update via backend
      try {
        const result = await window.API.Cart.updateQuantity(item.id, newQty);
        if (result.success) {
          item.qty = newQty;
          saveToLocalStorage();
          renderCartItems();
          return true;
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }

    // Fallback to local
    item.qty = Math.max(1, newQty);
    saveToLocalStorage();
    renderCartItems();
  }

  // Remove item from cart
  async function removeItem(index) {
    if (index < 0 || index >= cart.length) return;
    
    const item = cart[index];
    const userId = getUserId();

    if (userId && window.API && item.id) {
      // Remove via backend
      try {
        const result = await window.API.Cart.removeItem(item.id);
        if (result.success) {
          cart.splice(index, 1);
          saveToLocalStorage();
          renderCartItems();
          showNotification('O\'chirildi', 'info');
          return true;
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }

    // Fallback to local
    cart.splice(index, 1);
    saveToLocalStorage();
    renderCartItems();
    showNotification('O\'chirildi', 'info');
  }

  // Clear cart
  async function clearCart() {
    const userId = getUserId();

    if (userId && window.API) {
      // Clear all items via backend
      try {
        for (const item of cart) {
          if (item.id) {
            await window.API.Cart.removeItem(item.id);
          }
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }

    cart = [];
    saveToLocalStorage();
    renderCartItems();
    showNotification('Savat tozalandi', 'info');
  }

  // Render cart items
  function renderCartItems() {
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Savatcha bo\'sh</p>';
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;

    cart.forEach((item, idx) => {
      subtotal += item.price * item.qty;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
        <div class="meta">
          <h4>${item.name}</h4>
          <div class="small muted">$${item.price.toFixed(2)} each</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end">
          <div class="qty-controls">
            <button class="qty-minus" data-idx="${idx}">-</button>
            <div style="min-width:28px;text-align:center">${item.qty}</div>
            <button class="qty-plus" data-idx="${idx}">+</button>
            <button class="remove-btn" data-idx="${idx}">O'chirish</button>
          </div>
          <div style="margin-top:6px;font-weight:600">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
      
      container.appendChild(itemEl);
    });

    if (subtotalEl) {
      subtotalEl.textContent = '$' + subtotal.toFixed(2);
    }

    // Attach event listeners
    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        updateQuantity(idx, cart[idx].qty + 1);
      });
    });

    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        updateQuantity(idx, Math.max(1, cart[idx].qty - 1));
      });
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        removeItem(idx);
      });
    });
  }

  // Setup cart modal
  function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const overlay = document.getElementById('overlay');

    if (cartBtn) {
      cartBtn.addEventListener('click', async () => {
        await loadCart();
        renderCartItems();
        cartModal?.classList.add('active');
        overlay?.classList.add('active');
      });
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => {
        cartModal?.classList.remove('active');
        overlay?.classList.remove('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        cartModal?.classList.remove('active');
        overlay?.classList.remove('active');
      });
    }

    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        if (confirm('Savatchani tozalamoqchimisiz?')) {
          clearCart();
        }
      });
    }
  }

  // Setup add to cart buttons
  function setupAddToCartButtons() {
    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;

      e.stopPropagation();

      const productCard = btn.closest('.product');
      if (!productCard) return;

      const product = {
        productId: productCard.dataset.productId,
        id: productCard.dataset.productId,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        img: productCard.dataset.img
      };

      // Check if user is logged in
      if (!isLoggedIn()) {
        if (confirm('Savatchaga qo\'shish uchun tizimga kiring!\n\nTizimga kirmoqchimisiz?')) {
          document.getElementById('openLogin')?.click();
        }
        return;
      }

      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Qo\'shilmoqda...';

      const success = await addToCart(product);

      if (success) {
        btn.textContent = 'Qo\'shildi ✓';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // Helper functions
  function showNotification(message, type) {
    if (window.loadingSystem) {
      window.loadingSystem.showToast(message, type);
    }
  }

  // Get cart total
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  // Get cart items
  function getCartItems() {
    return cart;
  }

  // Initialize
  async function init() {
    await loadCart();
    setupCartModal();
    setupAddToCartButtons();
    renderCartItems();
  }

  // Expose to global
  window.cartSystem = {
    loadCart,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItems,
    renderCartItems
  };

  window.injectAddButtons = () => {
    // This is called from products-loader after rendering products
    // Buttons are already handled by setupAddToCartButtons
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();