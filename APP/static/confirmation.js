const ORDER_KEY = "teaAlchemyOrder";

const formatCurrency = (amount) => `A$${amount.toFixed(2)}`;

const readOrder = () => {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
};

const renderItems = (items) => {
  const container = document.querySelector("[data-order-items]");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items || !items.length) {
    container.innerHTML = '<p class="cart-empty">No order details available.</p>';
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "checkout-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div class="cart-item-meta">
          <span>${item.meta}</span>
          <span>${formatCurrency(item.total)}</span>
        </div>
      </div>
    `;
    container.appendChild(row);
  });
};

const renderOrder = () => {
  const order = readOrder();
  if (!order) {
    const note = document.querySelector("[data-order-note]");
    if (note) {
      note.textContent = "We could not find an order. Start a new blend to continue.";
    }
    return;
  }

  const orderId = document.querySelector("[data-order-id]");
  const orderDate = document.querySelector("[data-order-date]");
  const recipient = document.querySelector("[data-order-recipient]");
  const address = document.querySelector("[data-order-address]");
  const email = document.querySelector("[data-order-email]");
  const countNode = document.querySelector("[data-order-count]");
  const subtotalNode = document.querySelector("[data-order-subtotal]");
  const shippingNode = document.querySelector("[data-order-shipping]");
  const totalNode = document.querySelector("[data-order-total]");
  const note = document.querySelector("[data-order-note]");

  if (orderId) {
    orderId.textContent = order.id;
  }
  if (orderDate) {
    orderDate.textContent = order.placedAt;
  }
  if (recipient) {
    recipient.textContent = order.recipient;
  }
  if (address) {
    address.textContent = order.address;
  }
  if (email) {
    email.textContent = `Confirmation sent to ${order.email}`;
  }

  if (countNode) {
    countNode.textContent = `${order.count} item${order.count === 1 ? "" : "s"}`;
  }
  if (subtotalNode) {
    subtotalNode.textContent = formatCurrency(order.subtotal);
  }
  if (shippingNode) {
    shippingNode.textContent = formatCurrency(order.shipping);
  }
  if (totalNode) {
    totalNode.textContent = formatCurrency(order.total);
  }
  if (note) {
    const paymentLine = order.payment
      ? `${order.payment.provider} ${order.payment.method} ending ${order.payment.last4}`
      : "Secure card payment";
    note.textContent = `Paid securely via ${paymentLine}.`;
  }

  renderItems(order.items);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderOrder);
} else {
  renderOrder();
}
