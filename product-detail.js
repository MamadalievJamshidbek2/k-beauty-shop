// product-detail.js
const PRODUCT_API =
  "https://cosmetic-server-production.up.railway.app/api/products";

async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Product ID topilmadi");
    return;
  }

  try {
    const res = await fetch(`${PRODUCT_API}/${id}`);

    if (!res.ok) throw new Error("Product not found");

    const product = await res.json();

    // UI elementlar
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDesc").textContent =
      product.description;

    document.getElementById("productImage").src = product.imageUrl;

    const price = product.discountPrice ?? product.price;
    document.getElementById("productPrice").textContent = `$${price}`;

    document.getElementById("productStock").textContent =
      product.stock > 0 ? "Mavjud" : "Tugagan";

    // Stock yo‘q bo‘lsa savatchani o‘chiramiz
    const btn = document.getElementById("addToCartBtn");
    if (btn && product.stock <= 0) {
      btn.disabled = true;
      btn.textContent = "Tugagan";
    }

  } catch (err) {
    console.error("❌ Product detail error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
