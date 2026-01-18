const STORAGE_KEY = "teaAlchemyBlend";

const outcomeCards = document.querySelectorAll(".outcome-card");
const previewTitle = document.querySelector("[data-preview-title]");
const previewDescription = document.querySelector("[data-preview-description]");
const previewBases = document.querySelector("[data-preview-bases]");
const previewBotanicals = document.querySelector("[data-preview-botanicals]");
const previewBaseTitle = document.querySelector("[data-preview-base-title]");
const previewBaseDescription = document.querySelector("[data-preview-base-description]");
const previewAlignment = document.querySelector("[data-preview-alignment]");
const baseEmpty = document.querySelector("[data-base-empty]");
const baseGrids = document.querySelectorAll("[data-base-grid]");
const baseCards = document.querySelectorAll(".base-card");
const continueButton = document.querySelector("[data-continue]");

const outcomeAxes = (() => {
  if (!previewAlignment) {
    return ["Sleep", "Calm", "Focus", "Energy"];
  }

  const stored = previewAlignment.dataset.outcomeAxes;
  if (!stored) {
    return ["Sleep", "Calm", "Focus", "Energy"];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : ["Sleep", "Calm", "Focus", "Energy"];
  } catch (error) {
    console.warn("Unable to read outcome axes", error);
    return ["Sleep", "Calm", "Focus", "Energy"];
  }
})();

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

const renderAlignment = (alignment = {}) => {
  if (!previewAlignment) {
    return;
  }

  previewAlignment.innerHTML = "";
  outcomeAxes.forEach((axis) => {
    const value = alignment[axis] || 0;
    const row = document.createElement("div");
    row.className = "alignment-row";

    const label = document.createElement("span");
    label.className = "alignment-label";
    label.textContent = axis;

    const meter = document.createElement("div");
    meter.className = "alignment-meter";

    const fill = document.createElement("span");
    fill.style.width = `${value * 20}%`;
    meter.appendChild(fill);

    const score = document.createElement("span");
    score.className = "alignment-score";
    score.textContent = `${value}/5`;

    row.appendChild(label);
    row.appendChild(meter);
    row.appendChild(score);
    previewAlignment.appendChild(row);
  });
};

const resetBasePreview = () => {
  baseCards.forEach((item) => item.classList.remove("is-selected"));
  if (previewBaseTitle) {
    previewBaseTitle.textContent = "Pick a base tea";
  }
  if (previewBaseDescription) {
    previewBaseDescription.textContent =
      "The base tea will steer the balance of calm, focus, and energy in your blend.";
  }
  renderAlignment({});
  if (continueButton) {
    continueButton.disabled = true;
  }
};

const showBaseGrid = (outcomeId) => {
  baseGrids.forEach((grid) => {
    const isMatch = grid.dataset.baseGrid === outcomeId;
    grid.hidden = !isMatch;
  });
  if (baseEmpty) {
    baseEmpty.hidden = Boolean(outcomeId);
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

  showBaseGrid(card.dataset.outcomeId);
  resetBasePreview();

  storeSelection({
    outcomeId: card.dataset.outcomeId,
    outcomeTitle: title,
    bases,
    botanicals,
    baseId: null,
    baseTitle: null,
    baseDescription: null,
    baseAlignment: {},
  });
};

outcomeCards.forEach((card) => {
  card.addEventListener("click", () => applySelection(card));
});

const applyBaseSelection = (card) => {
  baseCards.forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");

  const title = card.dataset.baseTitle || "";
  const description = card.dataset.baseDescription || "";
  let alignment = {};

  if (card.dataset.alignment) {
    try {
      alignment = JSON.parse(card.dataset.alignment);
    } catch (error) {
      console.warn("Unable to read base alignment", error);
    }
  }

  if (previewBaseTitle) {
    previewBaseTitle.textContent = title;
  }
  if (previewBaseDescription) {
    previewBaseDescription.textContent = description;
  }

  renderAlignment(alignment);

  if (continueButton) {
    continueButton.disabled = false;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  let selection = {};
  if (stored) {
    try {
      selection = JSON.parse(stored);
    } catch (error) {
      console.warn("Unable to parse stored blend selection", error);
    }
  }

  storeSelection({
    ...selection,
    baseId: card.dataset.baseId,
    baseTitle: title,
    baseDescription: description,
    baseAlignment: alignment,
  });
};

baseCards.forEach((card) => {
  card.addEventListener("click", () => applyBaseSelection(card));
});

const restoreSelection = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }

  try {
    const selection = JSON.parse(stored);
    const matchOutcome = Array.from(outcomeCards).find(
      (card) => card.dataset.outcomeId === selection.outcomeId,
    );
    if (matchOutcome) {
      applySelection(matchOutcome);
    }

    if (selection.baseId) {
      const matchBase = Array.from(baseCards).find(
        (card) =>
          card.dataset.baseId === selection.baseId &&
          card.dataset.outcomeId === selection.outcomeId,
      );
      if (matchBase) {
        applyBaseSelection(matchBase);
      }
    }
  } catch (error) {
    console.warn("Unable to restore blend selection", error);
  }
};

restoreSelection();
