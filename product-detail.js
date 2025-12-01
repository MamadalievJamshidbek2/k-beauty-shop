(async function() {
  const API_BASE = "https://cosmetic-server-production.up.railway.app/api/products";

  // URL dan ID olish
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id")) || 1;
  }

  // API dan product olish
  async function fetchProduct() {
    const id = getProductId();

    try {
      const res = await fetch(`${API_BASE}/${id}`);

      if (!res.ok) throw new Error("Serverga ulanishda xato");

      return await res.json();
    } catch (error) {
      console.error("API Error:", error);
      alert("❌ Serverdan ma'lumot olishda xato!");
      return null;
    }
  }

  // Sahifaga product chiqarish
  function renderProduct(product) {
    if (!product) return;

    document.getElementById("productTitle").textContent = product.name;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productBrand").textContent = product.category;
    document.getElementById("productPrice").textContent = `$${product.price}`;
    document.getElementById("productDescription").textContent =
      product.description || "Tavsif mavjud emas";

    document.getElementById("productCategory").textContent = product.category;
    document.getElementById("productSKU").textContent = `KB-${String(product.id).padStart(3, "0")}`;

    // Rasm
    const mainImg = document.getElementById("mainImage");
    mainImg.src = product.imageUrl;
    mainImg.alt = product.name;

    // Thumbnail yasash
    const thumbs = document.getElementById("thumbnails");
    thumbs.innerHTML = "";

    for (let i = 0; i < 3; i++) {
      const t = document.createElement("img");
      t.src = product.imageUrl;
      t.className = "thumbnail" + (i === 0 ? " active" : "");
      t.onclick = () => changeMainImage(product.imageUrl, t);

      thumbs.appendChild(t);
    }
  }

  // Rasmni almashtirish
  function changeMainImage(src, thumbElement) {
    document.getElementById("mainImage").src = src;

    document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
    thumbElement.classList.add("active");
  }

  // Add to Cart funksiyasi ishlasin
  function setupCart(product) {
    const CART_KEY = "myshop_cart_v1";

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      const exists = cart.find(p => p.id === product.id);

      if (exists) {
        exists.qty++;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.imageUrl,
          qty: 1
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));

      alert("✅ Mahsulot savatchaga qo‘shildi!");
    });
  }

  // PAGE START
  async function init() {
    const product = await fetchProduct();

    if (!product) return;

    renderProduct(product);
    setupCart(product);
  }

  init();
})();
