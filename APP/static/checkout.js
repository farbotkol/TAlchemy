const CART_KEY = "teaAlchemyCart";
const BLEND_KEY = "teaAlchemyBlend";

const SHIPPING_RATES = {
  AU: { base: 6.5, freeThreshold: 65 },
  NZ: { base: 11.5, freeThreshold: 75 },
};

const formatCurrency = (amount) => `A$${amount.toFixed(2)}`;

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const readBlend = () => {
  try {
    const raw = localStorage.getItem(BLEND_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
};

const blendHasPrice = (blend) =>
  blend && typeof blend.sizePrice === "number" && !Number.isNaN(blend.sizePrice);

const calculateTotals = (cart, blend) => {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const blendCount = blendHasPrice(blend) ? 1 : 0;
  const blendTotal = blendHasPrice(blend) ? blend.sizePrice : 0;
  return {
    count: cartCount + blendCount,
    subtotal: cartTotal + blendTotal,
  };
};

const buildOrderItems = (cart, blend) => {
  const items = [];

  cart.forEach((item) => {
    items.push({
      name: item.name,
      meta: `${item.sizeLabel} · Qty ${item.quantity}`,
      total: item.unitPrice * item.quantity,
    });
  });

  if (blend) {
    const title = blend.blendName || "Custom Blend";
    const sizeLabel = blend.sizeLabel && blend.sizeGrams
      ? `${blend.sizeLabel} (${blend.sizeGrams}g)`
      : "Size not selected";
    items.push({
      name: title,
      meta: sizeLabel,
      total: blendHasPrice(blend) ? blend.sizePrice : 0,
    });
  }

  return items;
};

const renderOrderItems = (items) => {
  const container = document.querySelector("[data-order-items]");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = '<p class="cart-empty">No items in your cart yet.</p>';
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

const calculateShipping = (country, subtotal) => {
  if (!country || !SHIPPING_RATES[country]) {
    return null;
  }

  const { base, freeThreshold } = SHIPPING_RATES[country];
  if (subtotal >= freeThreshold) {
    return 0;
  }

  return base;
};

const updateStateLabels = (country) => {
  const label = document.querySelector("[data-shipping-state-label]");
  const stateInput = document.querySelector("[data-shipping-state]");
  const postalInput = document.querySelector("[data-shipping-postal]");

  if (!label || !stateInput || !postalInput) {
    return;
  }

  if (country === "NZ") {
    label.textContent = "Region";
    stateInput.placeholder = "Auckland";
    postalInput.placeholder = "1024";
  } else {
    label.textContent = "State / Territory";
    stateInput.placeholder = "NSW";
    postalInput.placeholder = "2000";
  }
};

const updateSummary = () => {
  const cart = readCart();
  const blend = readBlend();
  const { count, subtotal } = calculateTotals(cart, blend);
  const items = buildOrderItems(cart, blend);
  renderOrderItems(items);

  const countNode = document.querySelector("[data-order-count]");
  const subtotalNode = document.querySelector("[data-order-subtotal]");
  const shippingNode = document.querySelector("[data-order-shipping]");
  const totalNode = document.querySelector("[data-order-total]");

  if (countNode) {
    countNode.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }
  if (subtotalNode) {
    subtotalNode.textContent = formatCurrency(subtotal);
  }

  const countrySelect = document.querySelector("[data-shipping-country]");
  const country = countrySelect ? countrySelect.value : "";
  const shippingCost = calculateShipping(country, subtotal);

  if (shippingNode) {
    shippingNode.textContent = shippingCost === null ? "--" : formatCurrency(shippingCost);
  }

  if (totalNode) {
    const total = shippingCost === null ? subtotal : subtotal + shippingCost;
    totalNode.textContent = formatCurrency(total);
  }

  const submitButton = document.querySelector("[data-checkout-submit]");
  const message = document.querySelector("[data-checkout-message]");

  if (submitButton) {
    const canSubmit = count > 0;
    submitButton.disabled = !canSubmit;
    if (message) {
      message.textContent = canSubmit
        ? "Review your details, then place your order."
        : "Add at least one item to your cart to place an order.";
    }
  }

  const note = document.querySelector("[data-shipping-note]");
  if (note) {
    if (!country) {
      note.textContent = "Shipping is calculated after you select Australia or New Zealand.";
    } else if (shippingCost === 0) {
      note.textContent = "You qualify for free shipping.";
    } else {
      note.textContent = `Estimated shipping for ${country === "AU" ? "Australia" : "New Zealand"}.`;
    }
  }
};

const bindCheckoutForm = () => {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector("[data-checkout-message]");
    if (message) {
      message.textContent = "Demo checkout complete. Your order details are ready to process.";
    }
  });

  form.addEventListener("input", (event) => {
    if (event.target.matches("[data-shipping-country]")) {
      updateStateLabels(event.target.value);
    }
    updateSummary();
  });
};

const initCheckout = () => {
  bindCheckoutForm();
  updateSummary();
  const countrySelect = document.querySelector("[data-shipping-country]");
  if (countrySelect) {
    updateStateLabels(countrySelect.value);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCheckout);
} else {
  initCheckout();
}
