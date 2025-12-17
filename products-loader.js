// products-loader.js
const PRODUCT_API =
  "https://cosmetic-server-production.up.railway.app/api/products";

async function loadProducts(page = 0, size = 10) {
  try {
    const res = await fetch(
      `${PRODUCT_API}?page=${page}&size=${size}`
    );

    if (!res.ok) throw new Error("Products load error");

    const data = await res.json();

    // 🔥 MUHIM: backend pagination sabab CONTENT
    renderProducts(data.content);

  } catch (err) {
    console.error("❌ Product load error:", err);
  }
}

/* ====== UI RENDER ====== */
function renderProducts(products) {
  const container = document.getElementById("newArrivalsProducts");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    const price = p.discountPrice ?? p.price;

    const div = document.createElement("div");
    div.className = "product";
    div.dataset.productId = p.id;

    div.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="rating">⭐ ${p.favorite ? "4.5" : "4.0"}</div>
      <p class="price">$${price}</p>
    `;

    div.addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(div);
  });
}

/* ====== LOAD ON START ====== */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
