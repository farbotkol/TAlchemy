const STORAGE_KEY = "teaAlchemyBlend";

const outcomeCards = document.querySelectorAll(".outcome-card");
const previewTitle = document.querySelector("[data-preview-title]");
const previewDescription = document.querySelector("[data-preview-description]");
const previewBases = document.querySelector("[data-preview-bases]");
const previewBotanicals = document.querySelector("[data-preview-botanicals]");
const continueButton = document.querySelector("[data-continue]");

const updateList = (container, items) => {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
};

const storeSelection = (selection) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch (error) {
    console.warn("Unable to store blend selection", error);
  }
};

const applySelection = (card) => {
  outcomeCards.forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");

  const title = card.dataset.outcomeTitle || "";
  const description = card.dataset.outcomeDescription || "";
  const bases = (card.dataset.bases || "").split(",").filter(Boolean);
  const botanicals = (card.dataset.botanicals || "").split(",").filter(Boolean);

  if (previewTitle) {
    previewTitle.textContent = title;
  }
  if (previewDescription) {
    previewDescription.textContent = description;
  }

  updateList(previewBases, bases);
  updateList(previewBotanicals, botanicals);

  if (continueButton) {
    continueButton.disabled = false;
  }

  storeSelection({
    outcomeId: card.dataset.outcomeId,
    outcomeTitle: title,
    bases,
    botanicals,
  });
};

outcomeCards.forEach((card) => {
  card.addEventListener("click", () => applySelection(card));
});

const restoreSelection = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }

  try {
    const selection = JSON.parse(stored);
    const match = Array.from(outcomeCards).find(
      (card) => card.dataset.outcomeId === selection.outcomeId,
    );
    if (match) {
      applySelection(match);
    }
  } catch (error) {
    console.warn("Unable to restore blend selection", error);
  }
};

restoreSelection();
