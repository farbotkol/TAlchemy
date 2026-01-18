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
const botanicalEmpty = document.querySelector("[data-botanical-empty]");
const botanicalGrids = document.querySelectorAll("[data-botanical-grid]");
const botanicalCards = document.querySelectorAll(".botanical-card");
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

const updateList = (container, items, emptyMessage) => {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  if (items.length === 0 && emptyMessage) {
    const li = document.createElement("li");
    li.textContent = emptyMessage;
    container.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
};

const getStoredSelection = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn("Unable to parse stored blend selection", error);
    return {};
  }
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

const calculateCombinedAlignment = (baseAlignment = {}, botanicals = []) => {
  const combined = {};
  outcomeAxes.forEach((axis) => {
    let value = baseAlignment[axis] || 0;
    botanicals.forEach((botanical) => {
      if (botanical.contributions && botanical.contributions[axis]) {
        value += botanical.contributions[axis];
      }
    });
    combined[axis] = Math.min(5, value);
  });
  return combined;
};

const updateAlignmentPreview = (selection) => {
  const baseAlignment = selection.baseAlignment || {};
  const botanicals = selection.selectedBotanicals || [];
  renderAlignment(calculateCombinedAlignment(baseAlignment, botanicals));
};

const updateBotanicalPreview = (selection) => {
  const botanicals = selection.selectedBotanicals || [];
  const titles = botanicals.map((botanical) => botanical.title);
  updateList(
    previewBotanicals,
    titles,
    "Add botanicals to amplify your blend.",
  );
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
  updateAlignmentPreview({});
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

const showBotanicalGrid = (outcomeId, baseId) => {
  botanicalGrids.forEach((grid) => {
    const isMatch = grid.dataset.botanicalGrid === outcomeId;
    grid.hidden = !isMatch || !baseId;
  });
  if (botanicalEmpty) {
    botanicalEmpty.hidden = Boolean(outcomeId && baseId);
  }

  botanicalCards.forEach((card) => {
    const isMatch = card.dataset.outcomeId === outcomeId;
    const baseIds = (card.dataset.baseIds || "").split(",").filter(Boolean);
    const matchesBase = baseId && (baseIds.length === 0 || baseIds.includes(baseId));
    card.hidden = !(isMatch && baseId && matchesBase);
  });
};

const resetBotanicalSelection = () => {
  botanicalCards.forEach((item) => item.classList.remove("is-selected"));
  updateBotanicalPreview({ selectedBotanicals: [] });
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
  updateList(previewBotanicals, [], "Add botanicals to amplify your blend.");

  showBaseGrid(card.dataset.outcomeId);
  resetBasePreview();
  showBotanicalGrid(card.dataset.outcomeId, null);
  resetBotanicalSelection();

  storeSelection({
    outcomeId: card.dataset.outcomeId,
    outcomeTitle: title,
    bases,
    botanicals,
    baseId: null,
    baseTitle: null,
    baseDescription: null,
    baseAlignment: {},
    selectedBotanicals: [],
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

  if (continueButton) {
    continueButton.disabled = false;
  }

  const stored = getStoredSelection();
  const selection = {
    ...stored,
    baseId: card.dataset.baseId,
    baseTitle: title,
    baseDescription: description,
    baseAlignment: alignment,
  };

  showBotanicalGrid(selection.outcomeId, selection.baseId);
  selection.selectedBotanicals = reconcileBotanicals(selection);
  storeSelection(selection);
  updateBotanicalPreview(selection);
  updateAlignmentPreview(selection);
};

baseCards.forEach((card) => {
  card.addEventListener("click", () => applyBaseSelection(card));
});

const restoreSelection = () => {
  try {
    const selection = getStoredSelection();
    if (!selection.outcomeId) {
      return;
    }

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

    if (selection.selectedBotanicals) {
      selection.selectedBotanicals.forEach((botanical) => {
        const matchBotanical = Array.from(botanicalCards).find(
          (card) =>
            card.dataset.botanicalId === botanical.id &&
            card.dataset.outcomeId === selection.outcomeId,
        );
        if (matchBotanical) {
          matchBotanical.classList.add("is-selected");
        }
      });
      selection.selectedBotanicals = reconcileBotanicals(selection);
      storeSelection(selection);
      updateBotanicalPreview(selection);
      updateAlignmentPreview(selection);
    }
  } catch (error) {
    console.warn("Unable to restore blend selection", error);
  }
};

const botanicalCardById = new Map();
botanicalCards.forEach((card) => {
  if (card.dataset.botanicalId) {
    botanicalCardById.set(card.dataset.botanicalId, card);
  }
});

const isBotanicalAllowed = (card, outcomeId, baseId) => {
  if (!card || !outcomeId || !baseId) {
    return false;
  }
  if (card.dataset.outcomeId !== outcomeId) {
    return false;
  }
  const baseIds = (card.dataset.baseIds || "").split(",").filter(Boolean);
  return baseIds.length === 0 || baseIds.includes(baseId);
};

const reconcileBotanicals = (selection) => {
  const selected = selection.selectedBotanicals || [];
  const filtered = selected.filter((botanical) => {
    const card = botanicalCardById.get(botanical.id);
    return isBotanicalAllowed(card, selection.outcomeId, selection.baseId);
  });

  botanicalCards.forEach((card) => {
    const isSelected = filtered.some(
      (botanical) => botanical.id === card.dataset.botanicalId,
    );
    card.classList.toggle("is-selected", isSelected);
  });

  return filtered;
};

const toggleBotanicalSelection = (card) => {
  const selection = getStoredSelection();
  if (!selection.baseId) {
    return;
  }

  const existing = selection.selectedBotanicals || [];
  const isSelected = card.classList.contains("is-selected");
  let updated = existing;

  if (isSelected) {
    card.classList.remove("is-selected");
    updated = existing.filter(
      (botanical) => botanical.id !== card.dataset.botanicalId,
    );
  } else {
    card.classList.add("is-selected");
    let contributions = {};
    let attributes = [];
    if (card.dataset.botanicalContributions) {
      try {
        contributions = JSON.parse(card.dataset.botanicalContributions);
      } catch (error) {
        console.warn("Unable to read botanical contributions", error);
      }
    }
    if (card.dataset.botanicalAttributes) {
      try {
        attributes = JSON.parse(card.dataset.botanicalAttributes);
      } catch (error) {
        console.warn("Unable to read botanical attributes", error);
      }
    }
    updated = [
      ...existing,
      {
        id: card.dataset.botanicalId,
        title: card.dataset.botanicalTitle || "",
        attributes,
        contributions,
      },
    ];
  }

  const reconciled = reconcileBotanicals({
    ...selection,
    selectedBotanicals: updated,
  });
  const nextSelection = {
    ...selection,
    selectedBotanicals: reconciled,
  };

  storeSelection(nextSelection);
  updateBotanicalPreview(nextSelection);
  updateAlignmentPreview(nextSelection);
};

botanicalCards.forEach((card) => {
  card.addEventListener("click", () => toggleBotanicalSelection(card));
});

restoreSelection();
