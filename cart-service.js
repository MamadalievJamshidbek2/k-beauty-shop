const CART_API = "https://cosmetic-server-production.up.railway.app/api/cart";

async function cartAdd(userId, productId, quantity) {
  const res = await fetch(`${CART_API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity })
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function cartGet(userId) {
  const res = await fetch(`${CART_API}/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function cartUpdate(cartId, quantity) {
  const res = await fetch(`${CART_API}/${cartId}?quantity=${quantity}`, {
    method: "PUT"
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
}

async function cartDelete(cartId) {
  const res = await fetch(`${CART_API}/${cartId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
}
