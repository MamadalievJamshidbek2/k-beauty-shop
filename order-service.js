const ORDER_API = "https://cosmetic-server-production.up.railway.app/api/orders";

/* ================================
   CREATE ORDER
================================ */
async function createOrder(userId, address, totalAmount) {
  const res = await fetch(`${ORDER_API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      userId,
      address,
      totalAmount
    })
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text;
}

/* ================================
   GET ORDER BY ID
================================ */
async function getOrder(id) {
  const res = await fetch(`${ORDER_API}/${id}`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}

/* ================================
   UPDATE ORDER STATUS
================================ */
async function updateOrderStatus(id, status) {
  const res = await fetch(`${ORDER_API}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(status) // backend "PAID" string kutadi
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text;
}

/* ================================
   DELETE ORDER
================================ */
async function deleteOrder(id) {
  const res = await fetch(`${ORDER_API}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text;
}
