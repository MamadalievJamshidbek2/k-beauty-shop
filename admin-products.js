const API = "https://cosmetic-server-production.up.railway.app/api/products";

/* =========================
   GET ALL PRODUCTS
========================= */
async function loadProducts() {
  const res = await fetch(API);
  const data = await res.json();

  const list = document.getElementById("productList");
  list.innerHTML = "";

  data.forEach(p => {
    const item = document.createElement("div");
    item.className = "admin-product";
    item.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.imageUrl}" width="120">
      <p>${p.description}</p>
      <p><b>$${p.price}</b></p>
      <button onclick="editProduct(${p.id})">Edit</button>
      <button onclick="deleteProduct(${p.id})">Delete</button>
    `;
    list.appendChild(item);
  });
}

loadProducts();

/* =========================
   PRODUCT POST (CREATE)
========================= */
async function createProduct() {
  const body = {
    name: document.getElementById("pname").value,
    description: document.getElementById("pdesc").value,
    price: Number(document.getElementById("pprice").value),
    imageUrl: document.getElementById("pimage").value,
    category: document.getElementById("pcategory").value
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    alert("❌ Error: " + await res.text());
    return;
  }

  alert("✅ Product Added!");
  loadProducts();
}

/* =========================
   PRODUCT PUT (UPDATE)
========================= */
async function updateProduct() {
  const id = document.getElementById("productId").value;

  const body = {
    name: document.getElementById("pname").value,
    description: document.getElementById("pdesc").value,
    price: Number(document.getElementById("pprice").value),
    imageUrl: document.getElementById("pimage").value,
    category: document.getElementById("pcategory").value
  };

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    alert("❌ Update Error: " + await res.text());
    return;
  }

  alert("✅ Product Updated!");
  loadProducts();
}

/* =========================
   LOAD PRODUCT INTO FORM (EDIT)
========================= */
async function editProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();

  document.getElementById("productId").value = p.id;
  document.getElementById("pname").value = p.name;
  document.getElementById("pdesc").value = p.description;
  document.getElementById("pprice").value = p.price;
  document.getElementById("pimage").value = p.imageUrl;
  document.getElementById("pcategory").value = p.category;

  document.getElementById("formTitle").innerText = "Edit Product";
  document.getElementById("updateBtn").style.display = "block";
}

/* =========================
   PRODUCT DELETE
========================= */
async function deleteProduct(id) {
  if (!confirm("O‘chirishni xohlaysizmi?")) return;

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    alert("❌ Delete Error: " + await res.text());
    return;
  }

  alert("🗑 Product Deleted!");
  loadProducts();
}
