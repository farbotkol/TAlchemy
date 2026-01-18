const CART_KEY = "teaAlchemyCart";

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

const initCart = () => {
  renderCart(readCart());
  bindAddToCartButtons();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCart);
} else {
  initCart();
}
