const CART_KEY = "teaAlchemyCart";
const BLEND_KEY = "teaAlchemyBlend";

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

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const cartKeyFor = (item) => `${item.id}::${item.sizeLabel}`;

const addToCart = (entry) => {
  const cart = readCart();
  const key = cartKeyFor(entry);
  const existing = cart.find((item) => cartKeyFor(item) === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...entry, quantity: 1 });
  }
  writeCart(cart);
  return cart;
};

const renderCart = (cart) => {
  const itemsContainer = document.querySelector("[data-cart-items]");
  const countContainer = document.querySelector("[data-cart-count]");
  const totalContainer = document.querySelector("[data-cart-total]");

  if (!itemsContainer || !countContainer || !totalContainer) {
    return;
  }

  itemsContainer.innerHTML = "";

  if (!cart.length) {
    itemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    countContainer.textContent = "0 items";
    totalContainer.textContent = formatCurrency(0);
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  cart.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "cart-item";
    const lineTotal = item.unitPrice * item.quantity;

    wrapper.innerHTML = `
      <strong>${item.name}</strong>
      <div class="cart-item-meta">
        <span>${item.sizeLabel} - Qty ${item.quantity}</span>
        <span>${formatCurrency(lineTotal)}</span>
      </div>
    `;

    itemsContainer.appendChild(wrapper);
  });

  countContainer.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
  totalContainer.textContent = formatCurrency(totalPrice);
};

const blendHasPrice = (blend) =>
  blend && typeof blend.sizePrice === "number" && !Number.isNaN(blend.sizePrice);

const updateCheckoutAction = (hasItems) => {
  const button = document.querySelector("[data-checkout-button]");
  if (!button) {
    return;
  }

  button.disabled = !hasItems;
  if (hasItems) {
    button.removeAttribute("aria-disabled");
  } else {
    button.setAttribute("aria-disabled", "true");
  }
};

const updateCartSummary = (cart, blend) => {
  const countContainer = document.querySelector("[data-cart-count]");
  const totalContainer = document.querySelector("[data-cart-total]");

  if (!countContainer || !totalContainer) {
    return;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const blendCount = blendHasPrice(blend) ? 1 : 0;
  const blendTotal = blendHasPrice(blend) ? blend.sizePrice : 0;
  const totalItems = cartCount + blendCount;

  countContainer.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
  totalContainer.textContent = formatCurrency(cartTotal + blendTotal);
  updateCheckoutAction(totalItems > 0);
};

const renderCartReviewItems = (cart) => {
  const itemsContainer = document.querySelector("[data-cart-items]");
  if (!itemsContainer) {
    return;
  }

  itemsContainer.innerHTML = "";

  if (!cart.length) {
    itemsContainer.innerHTML = '<p class="cart-empty">No pre-made blends added yet.</p>';
    return;
  }

  cart.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "cart-review-item";
    const lineTotal = item.unitPrice * item.quantity;

    wrapper.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div class="cart-item-meta">
          <span>${item.sizeLabel} - Qty ${item.quantity}</span>
          <span>${formatCurrency(lineTotal)}</span>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove-key="${cartKeyFor(item)}">
        Remove
      </button>
    `;

    itemsContainer.appendChild(wrapper);
  });
};

const renderBlendPanel = (blend) => {
  const container = document.querySelector("[data-custom-blend]");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!blend) {
    container.innerHTML = '<p class="cart-empty">No custom blend saved yet.</p>';
    return;
  }

  const botanicals = (blend.selectedBotanicals || []).map((item) => item.title);
  const flavors = (blend.selectedFlavors || []).map((item) => item.title);
  const sizeLabel = blend.sizeLabel && blend.sizeGrams
    ? `${blend.sizeLabel} (${blend.sizeGrams}g)`
    : "Size not selected";
  const priceLabel = blendHasPrice(blend)
    ? formatCurrency(blend.sizePrice)
    : "Select a size to price";

  const details = [
    { label: "Outcome", value: blend.outcomeTitle || "Outcome not selected" },
    { label: "Base", value: blend.baseTitle || "Base not selected" },
    {
      label: "Functional botanicals",
      value: botanicals.length ? botanicals.join(", ") : "None selected",
    },
    {
      label: "Flavor botanicals",
      value: flavors.length ? flavors.join(", ") : "None selected",
    },
    { label: "Size", value: sizeLabel },
    { label: "Price", value: priceLabel },
  ];

  const title = blend.blendName || "Custom Blend";
  const titleNode = document.createElement("h3");
  titleNode.className = "cart-review-title";
  titleNode.textContent = title;

  const list = document.createElement("dl");
  list.className = "cart-detail-list";

  details.forEach((detail) => {
    const row = document.createElement("div");
    row.className = "cart-detail-row";

    const term = document.createElement("dt");
    term.textContent = detail.label;

    const value = document.createElement("dd");
    value.textContent = detail.value;

    row.appendChild(term);
    row.appendChild(value);
    list.appendChild(row);
  });

  const removeButton = document.createElement("button");
  removeButton.className = "remove-item";
  removeButton.type = "button";
  removeButton.dataset.removeBlend = "true";
  removeButton.textContent = "Remove blend";

  container.appendChild(titleNode);
  container.appendChild(list);
  container.appendChild(removeButton);
};

const renderCartReview = (cart, blend) => {
  const reviewContainer = document.querySelector("[data-cart-review]");
  if (!reviewContainer) {
    return;
  }

  renderCartReviewItems(cart);
  renderBlendPanel(blend);
  updateCartSummary(cart, blend);
};

const bindAddToCartButtons = () => {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const productName = button.dataset.productName;
      const sizeLabel = button.dataset.sizeLabel;
      const price = Number.parseFloat(button.dataset.price);

      if (!productId || !productName || !sizeLabel || Number.isNaN(price)) {
        return;
      }

      const cart = addToCart({
        id: productId,
        name: productName,
        sizeLabel,
        unitPrice: price,
      });

      renderCart(cart);
    });
  });
};

const bindCartReviewActions = () => {
  const reviewContainer = document.querySelector("[data-cart-review]");
  if (!reviewContainer) {
    return;
  }

  reviewContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-key]");
    if (removeButton) {
      const key = removeButton.dataset.removeKey;
      const cart = readCart().filter((item) => cartKeyFor(item) !== key);
      writeCart(cart);
      renderCartReview(cart, readBlend());
      return;
    }

    const removeBlend = event.target.closest("[data-remove-blend]");
    if (removeBlend) {
      localStorage.removeItem(BLEND_KEY);
      renderCartReview(readCart(), readBlend());
    }
  });
};

const bindCheckoutButton = () => {
  const button = document.querySelector("[data-checkout-button]");
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    if (button.disabled) {
      return;
    }
    window.location.href = "/checkout";
  });
};

const initCart = () => {
  const cart = readCart();
  const hasReview = Boolean(document.querySelector("[data-cart-review]"));

  if (hasReview) {
    renderCartReview(cart, readBlend());
    bindCartReviewActions();
  } else {
    renderCart(cart);
  }

  bindAddToCartButtons();
  bindCheckoutButton();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCart);
} else {
  initCart();
}
