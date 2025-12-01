// Temporary user ID (login bo‘lsa token orqali olamiz)
const USER_ID = 1;

// URL dan product ID olish
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

// Quantity boshqaruvi
let qty = 1;

document.getElementById("qtyMinus").onclick = () => {
  if (qty > 1) qty--;
  document.getElementById("qtyValue").textContent = qty;
};

document.getElementById("qtyPlus").onclick = () => {
  qty++;
  document.getElementById("qtyValue").textContent = qty;
};

// Savatchaga qo‘shish
document.getElementById("addToCartBtn").onclick = async () => {
  const productId = getProductId();

  if (!productId) {
    alert("❌ Product ID topilmadi!");
    return;
  }

  try {
    await cartAdd(USER_ID, productId, qty);

    const btn = document.getElementById("addToCartBtn");
    btn.textContent = "Qo‘shildi ✓";
    btn.style.background = "#4CAF50";

    setTimeout(() => {
      btn.textContent = "Savatchaga qo‘shish";
      btn.style.background = "";
    }, 1500);

    // Savatcha belgisini yangilash uchun custom event
    document.dispatchEvent(new Event("cart-updated"));

  } catch (err) {
    alert("❌ Xatolik: " + err.message);
  }
};
