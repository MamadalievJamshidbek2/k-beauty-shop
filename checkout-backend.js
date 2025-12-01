// Checkout with Backend API Integration

(function() {

  // Load checkout page
  async function loadCheckoutPage() {
    const userId = window.API?.getCurrentUserId();

    if (!userId) {
      // Redirect to login
      alert('Buyurtma berish uchun tizimga kiring!');
      window.location.href = 'index.html';
      return;
    }

    // Load cart from backend
    const cart = await window.cartSystem?.loadCart() || [];

    if (cart.length === 0) {
      showEmptyCart();
      return;
    }

    renderCheckoutPage(cart);
  }

  // Show empty cart message
  function showEmptyCart() {
    const container = document.getElementById('checkoutContent');
    if (!container) return;

    container.innerHTML = `
      <div class="empty-cart">
        <h2>Savatingiz bo'sh</h2>
        <p>Buyurtma berish uchun avval mahsulot qo'shing</p>
        <a href="index.html">Xarid qilishni boshlash</a>
      </div>
    `;
  }

  // Render checkout page
  function renderCheckoutPage(cart) {
    const container = document.getElementById('checkoutContent');
    if (!container) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Build order items HTML
    let orderItemsHTML = '';
    cart.forEach(item => {
      orderItemsHTML += `
        <div class="order-item">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
          <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-qty">Miqdor: ${item.qty}</div>
          </div>
          <div class="order-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="checkout-grid">
        <!-- Order Summary -->
        <div class="order-summary">
          <h2>Buyurtma tafsilotlari</h2>
          ${orderItemsHTML}
          <div class="order-total">
            <div>Jami:</div>
            <div>$${subtotal.toFixed(2)}</div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="checkout-form">
          <form id="checkoutForm">
            <h2>Yetkazib berish ma'lumotlari</h2>
            
            <div class="form-group">
              <label for="fullName">To'liq ism *</label>
              <input type="text" id="fullName" required placeholder="Ismingiz va familiyangiz">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Telefon *</label>
                <input type="tel" id="phone" required placeholder="+998 90 123 45 67">
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="sizning@email.com">
              </div>
            </div>

            <div class="form-group">
              <label for="address">Manzil *</label>
              <textarea id="address" required placeholder="Ko'cha, uy raqami, kvartira"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">Shahar *</label>
                <input type="text" id="city" required placeholder="Toshkent" value="Toshkent">
              </div>

              <div class="form-group">
                <label for="region">Viloyat</label>
                <select id="region">
                  <option value="">Tanlang</option>
                  <option value="tashkent" selected>Toshkent</option>
                  <option value="samarkand">Samarqand</option>
                  <option value="bukhara">Buxoro</option>
                  <option value="andijan">Andijon</option>
                  <option value="fergana">Farg'ona</option>
                  <option value="namangan">Namangan</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>
            </div>

            <h2 style="margin-top: 30px;">To'lov ma'lumotlari</h2>

            <div class="form-group">
              <label for="paymentMethod">To'lov usuli *</label>
              <select id="paymentMethod" required>
                <option value="cash">Naqd pul (yetkazib berishda)</option>
                <option value="card">Plastik karta</option>
                <option value="payme">Payme</option>
                <option value="click">Click</option>
              </select>
            </div>

            <button type="submit" class="submit-btn" id="submitOrderBtn">
              Buyurtmani tasdiqlash ($${subtotal.toFixed(2)})
            </button>
          </form>
        </div>
      </div>
    `;

    setupCheckoutForm();
  }

  // Setup checkout form submission
  function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userId = window.API?.getCurrentUserId();
      if (!userId) {
        alert('Tizimga kiring!');
        return;
      }

      // Get form data
      const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        region: document.getElementById('region').value,
        paymentMethod: document.getElementById('paymentMethod').value
      };

      // Validation
      if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
        alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
        return;
      }

      // Get cart total
      const cart = window.cartSystem?.getCartItems() || [];
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      // Create full address string
      const fullAddress = `${formData.address}, ${formData.city}${formData.region ? ', ' + formData.region : ''}. Tel: ${formData.phone}`;

      // Disable button and show loading
      const submitBtn = document.getElementById('submitOrderBtn');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Buyurtma yuklanmoqda...';

      if (window.loadingSystem) {
        window.loadingSystem.showLoading('Buyurtma yaratilmoqda...');
      }

      try {
        // Create order via API
        const result = await window.API.Orders.create(
          userId,
          fullAddress,
          totalAmount
        );

        if (window.loadingSystem) {
          window.loadingSystem.hideLoading();
        }

        if (result.success) {
          // Clear cart
          await window.cartSystem?.clearCart();

          // Show success message
          showSuccessPage(result.data);
        } else {
          throw new Error(result.message || 'Buyurtma yaratishda xatolik!');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        
        if (window.loadingSystem) {
          window.loadingSystem.hideLoading();
        }

        alert('Buyurtma yaratishda xatolik yuz berdi!\n\n' + error.message);
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Show success page
  function showSuccessPage(orderData) {
    const container = document.getElementById('checkoutContent');
    if (!container) return;

    const orderId = orderData.id || 'N/A';
    const orderNumber = `#${String(orderId).padStart(6, '0')}`;

    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 80px; margin-bottom: 20px;">✅</div>
        <h1 style="color: #4CAF50; margin-bottom: 20px;">Buyurtma qabul qilindi!</h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 10px;">
          Buyurtma raqami: <strong>${orderNumber}</strong>
        </p>
        <p style="font-size: 16px; color: #666; margin-bottom: 30px;">
          Tez orada operatorlarimiz siz bilan bog'lanadi.
        </p>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 12px; max-width: 500px; margin: 30px auto;">
          <h3 style="margin-bottom: 15px; color: #111;">Buyurtma ma'lumotlari</h3>
          <div style="text-align: left;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
              <span>Jami summa:</span>
              <strong>$${(orderData.totalAmount || 0).toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
              <span>Holat:</span>
              <strong style="color: #FF9800;">Kutilmoqda</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span>Sana:</span>
              <strong>${new Date().toLocaleDateString('uz-UZ')}</strong>
            </div>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <a href="index.html" style="
            display: inline-block;
            background: #111;
            color: white;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 0 10px;
          ">Bosh sahifaga qaytish</a>
        </div>
      </div>
    `;

    if (window.loadingSystem) {
      window.loadingSystem.showToast('Buyurtma muvaffaqiyatli yaratildi!', 'success');
    }
  }

  // Initialize
  function init() {
    if (document.getElementById('checkoutContent')) {
      loadCheckoutPage();
    }
  }

  // Expose to global
  window.checkoutSystem = {
    loadCheckoutPage
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();