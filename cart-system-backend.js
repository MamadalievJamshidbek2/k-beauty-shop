const USER_ID = 1; // Hozircha test uchun

async function loadCart() {
  const items = await cartGet(USER_ID);

  const container = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");

  container.innerHTML = "";

  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.product.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.product.imageUrl}">
      <div class="meta">
        <h4>${item.product.name}</h4>
        <div>${item.product.price}$ x ${item.quantity}</div>
      </div>
      <div class="qty-controls">
        <button onclick="updateQty(${item.id}, ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQty(${item.id}, ${item.quantity + 1})">+</button>
        <button onclick="removeItem(${item.id})">🗑</button>
      </div>
    `;

    container.appendChild(div);
  });

  subtotalEl.textContent = `$${subtotal}`;
}

async function updateQty(id, qty) {
  if (qty <= 0) return;
  await cartUpdate(id, qty);
  loadCart();
}

async function removeItem(id) {
  await cartDelete(id);
  loadCart();
}

document.getElementById("cartBtn").addEventListener("click", loadCart);
