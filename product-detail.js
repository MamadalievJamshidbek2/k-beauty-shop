// Product Detail Page Logic

(function() {
  const CART_STORAGE_KEY = 'myshop_cart_v1';
  let currentProduct = null;
  let currentQuantity = 1;

  // Get product ID from URL
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
  }

  // Load product data
  function loadProduct() {
    const productId = getProductId();
    currentProduct = ALL_PRODUCTS.find(p => p.id === productId);

    if (!currentProduct) {
      window.location.href = 'parfum.html';
      return;
    }

    renderProduct();
  }

  // Render product details
  function renderProduct() {
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productTitle').textContent = currentProduct.name;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `$${currentProduct.price}`;
    
    // Rating
    const stars = '⭐'.repeat(Math.floor(currentProduct.rating));
    document.getElementById('productStars').textContent = stars;

    // Old price and discount
    if (currentProduct.oldPrice) {
      document.getElementById('productOldPrice').textContent = `$${currentProduct.oldPrice}`;
      document.getElementById('productDiscount').textContent = `-${currentProduct.discount}%`;
    } else {
      document.getElementById('productOldPrice').style.display = 'none';
      document.getElementById('productDiscount').style.display = 'none';
    }

    // Description
    const descriptions = {
      'LOE': 'Eksklyuziv LOE parfyumi - nafis va uzoq muddatli hid. Premium Korean ingredientlar bilan tayyorlangan.',
      'SW19': 'SW19 parfyumi - zamonaviy va dinamik hid. Yoshlar uchun maxsus ishlab chiqilgan.',
      'BTSO': 'BTSO urban parfyumi - shahar hayoti uchun. Fresh va energetik hid.',
      'GRANHAND': 'GRANHAND premium parfyumi - tabiiy ingredientlar. Ekologik toza mahsulot.',
      'TAMBURINS': 'TAMBURINS luxury parfyumi - eng yuqori sifat. Noyob va eksklyuziv hid.',
      'K-BEAUTY': 'K-BEAUTY parfyumi - klassik va nafis. Har qanday voqea uchun mos.'
    };

    document.getElementById('productDescription').textContent = 
      descriptions[currentProduct.brand] || 'Premium Korean parfyum - yuqori sifat va eksklyuziv hid.';

    // Images
    document.getElementById('mainImage').src = currentProduct.img;
    document.getElementById('mainImage').alt = currentProduct.name;

    // Generate thumbnails (using same image for demo)
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const thumb = document.createElement('img');
      thumb.src = currentProduct.img;
      thumb.className = 'thumbnail' + (i === 0 ? ' active' : '');
      thumb.onclick = () => changeMainImage(currentProduct.img, thumb);
      thumbnailsContainer.appendChild(thumb);
    }

    // SKU
    document.getElementById('productSKU').textContent = `KB-${String(currentProduct.id).padStart(3, '0')}`;
  }

  // Change main image
  function changeMainImage(src, thumbElement) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
  }

  // Quantity controls
  function setupQuantityControls() {
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    qtyMinus.addEventListener('click', () => {
      if (qtyInput.value > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
        currentQuantity = parseInt(qtyInput.value);
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (qtyInput.value < 99) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
        currentQuantity = parseInt(qtyInput.value);
      }
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value);
      if (val < 1) val = 1;
      if (val > 99) val = 99;
      qtyInput.value = val;
      currentQuantity = val;
    });
  }

  // Add to cart
  function setupAddToCart() {
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
      } catch (e) {}

      const existingIndex = cart.findIndex(item => item.name === currentProduct.name);
      
      if (existingIndex >= 0) {
        cart[existingIndex].qty += currentQuantity;
      } else {
        cart.push({
          name: currentProduct.name,
          price: currentProduct.price,
          img: currentProduct.img,
          qty: currentQuantity
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      // Show success message
      const btn = document.getElementById('addToCartBtn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Qo\'shildi!';
      btn.style.background = '#4CAF50';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#111';
      }, 2000);
    });
  }

  // Initialize
  function init() {
    loadProduct();
    setupQuantityControls();
    setupAddToCart();
    setupCartModal();
  }

  // Setup cart modal (basic version)
  function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        renderCartItems();
        cartModal.classList.add('active');
        overlay.classList.add('active');
      });
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
      });
    }
  }

  function renderCartItems() {
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {}

    if (cart.length === 0) {
      container.innerHTML = '<p>Savatcha bo\'sh</p>';
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    container.innerHTML = '';

    cart.forEach((item, idx) => {
      subtotal += item.price * item.qty;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="meta">
          <h4>${item.name}</h4>
          <div class="small muted">$${item.price} each</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end">
          <div>${item.qty}x</div>
          <div style="margin-top:6px;font-weight:600">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
      container.appendChild(itemEl);
    });

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();