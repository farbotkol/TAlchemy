const STORAGE_KEY = "teaAlchemyBlend";

const outcomeCards = document.querySelectorAll(".outcome-card");
const previewTitle = document.querySelector("[data-preview-title]");
const previewDescription = document.querySelector("[data-preview-description]");
const previewBases = document.querySelector("[data-preview-bases]");
const previewBotanicals = document.querySelector("[data-preview-botanicals]");
const previewFlavors = document.querySelector("[data-preview-flavors]");
const previewBaseTitle = document.querySelector("[data-preview-base-title]");
const previewBaseDescription = document.querySelector("[data-preview-base-description]");
const radarChart = document.querySelector("[data-radar-chart]");
const radarGrid = radarChart ? radarChart.querySelector("[data-radar-grid]") : null;
const radarAxes = radarChart ? radarChart.querySelector("[data-radar-axes]") : null;
const radarShape = radarChart ? radarChart.querySelector("[data-radar-shape]") : null;
const radarPoints = radarChart ? radarChart.querySelector("[data-radar-points]") : null;
const radarLabels = radarChart ? radarChart.querySelector("[data-radar-labels]") : null;
const radarScores = document.querySelector("[data-radar-scores]");
const baseEmpty = document.querySelector("[data-base-empty]");
const baseGrids = document.querySelectorAll("[data-base-grid]");
const baseCards = document.querySelectorAll(".base-card");
const botanicalEmpty = document.querySelector("[data-botanical-empty]");
const botanicalGrids = document.querySelectorAll("[data-botanical-grid]");
const botanicalCards = document.querySelectorAll(".botanical-card");
const flavorEmpty = document.querySelector("[data-flavor-empty]");
const flavorGrids = document.querySelectorAll("[data-flavor-grid]");
const flavorCards = document.querySelectorAll(".flavor-card");
const flavorWarning = document.querySelector("[data-flavor-warning]");
const flavorSpectrum = document.querySelector("[data-flavor-spectrum]");
const continueButton = document.querySelector("[data-continue]");

const outcomeAxes = (() => {
  if (!radarChart) {
    return ["Sleep", "Calm", "Focus", "Alertness"];
  }

  const stored = radarChart.dataset.outcomeAxes;
  if (!stored) {
    return ["Sleep", "Calm", "Focus", "Alertness"];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : ["Sleep", "Calm", "Focus", "Alertness"];
  } catch (error) {
    console.warn("Unable to read outcome axes", error);
    return ["Sleep", "Calm", "Focus", "Alertness"];
  }
})();

const flavorCategories = (() => {
  if (!flavorSpectrum) {
    return ["Floral", "Citrus", "Earthy", "Spicy", "Sweet"];
  }

  const stored = flavorSpectrum.dataset.flavorCategories;
  if (!stored) {
    return ["Floral", "Citrus", "Earthy", "Spicy", "Sweet"];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : ["Floral", "Citrus", "Earthy", "Spicy", "Sweet"];
  } catch (error) {
    console.warn("Unable to read flavor categories", error);
    return ["Floral", "Citrus", "Earthy", "Spicy", "Sweet"];
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

const updateFlavorWarning = (message) => {
  if (!flavorWarning) {
    return;
  }

  if (message) {
    flavorWarning.textContent = message;
    flavorWarning.hidden = false;
  } else {
    flavorWarning.hidden = true;
  }
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

const RADAR_SIZE = 240;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 78;
const RADAR_STEPS = 5;

let radarReady = false;
let radarPointNodes = [];
let radarScoreNodes = [];
let flavorSpectrumReady = false;
let flavorSpectrumRows = [];

const createSvgElement = (tag) =>
  document.createElementNS("http://www.w3.org/2000/svg", tag);

const axisAngle = (index, total) => (Math.PI * 2 * index) / total - Math.PI / 2;

const pointAtRadius = (index, total, radius) => {
  const angle = axisAngle(index, total);
  return {
    x: RADAR_CENTER + radius * Math.cos(angle),
    y: RADAR_CENTER + radius * Math.sin(angle),
  };
};

const initRadarChart = () => {
  if (!radarChart || radarReady) {
    return;
  }

  if (!radarGrid || !radarAxes || !radarLabels || !radarPoints) {
    return;
  }

  radarGrid.innerHTML = "";
  radarAxes.innerHTML = "";
  radarLabels.innerHTML = "";
  radarPoints.innerHTML = "";
  if (radarScores) {
    radarScores.innerHTML = "";
  }

  const total = outcomeAxes.length;
  radarPointNodes = [];
  radarScoreNodes = [];

  for (let step = 1; step <= RADAR_STEPS; step += 1) {
    const radius = (RADAR_RADIUS * step) / RADAR_STEPS;
    const ringPoints = outcomeAxes.map((axis, index) => {
      const point = pointAtRadius(index, total, radius);
      return `${point.x},${point.y}`;
    });
    const ring = createSvgElement("polygon");
    ring.setAttribute("points", ringPoints.join(" "));
    ring.classList.add("radar-ring");
    radarGrid.appendChild(ring);
  }

  outcomeAxes.forEach((axis, index) => {
    const axisEnd = pointAtRadius(index, total, RADAR_RADIUS);
    const line = createSvgElement("line");
    line.setAttribute("x1", RADAR_CENTER);
    line.setAttribute("y1", RADAR_CENTER);
    line.setAttribute("x2", axisEnd.x);
    line.setAttribute("y2", axisEnd.y);
    line.classList.add("radar-axis");
    radarAxes.appendChild(line);

    const labelPoint = pointAtRadius(index, total, RADAR_RADIUS + 18);
    const label = createSvgElement("text");
    label.setAttribute("x", labelPoint.x);
    label.setAttribute("y", labelPoint.y);
    label.setAttribute("dominant-baseline", "middle");
    const cosValue = Math.cos(axisAngle(index, total));
    if (Math.abs(cosValue) < 0.2) {
      label.setAttribute("text-anchor", "middle");
    } else {
      label.setAttribute("text-anchor", cosValue > 0 ? "start" : "end");
    }
    label.classList.add("radar-label");
    label.textContent = axis;
    radarLabels.appendChild(label);

    const point = createSvgElement("circle");
    point.setAttribute("r", "4");
    point.classList.add("radar-point");
    radarPoints.appendChild(point);
    radarPointNodes.push(point);

    if (radarScores) {
      const item = document.createElement("li");
      item.className = "radar-score-item";
      item.textContent = `${axis}: 0/5`;
      radarScores.appendChild(item);
      radarScoreNodes.push(item);
    }
  });

  radarReady = true;
};

const getAxisValue = (source, axis) => {
  if (!source || typeof source !== "object") {
    return 0;
  }
  if (Object.prototype.hasOwnProperty.call(source, axis)) {
    return source[axis] || 0;
  }
  if (axis === "Alertness" && Object.prototype.hasOwnProperty.call(source, "Energy")) {
    return source.Energy || 0;
  }
  return 0;
};

const renderRadarChart = (alignment = {}) => {
  if (!radarChart || !radarShape) {
    return;
  }

  initRadarChart();
  const total = outcomeAxes.length;
  const points = outcomeAxes.map((axis, index) => {
    const value = Math.min(5, getAxisValue(alignment, axis));
    const radius = (RADAR_RADIUS * value) / RADAR_STEPS;
    const point = pointAtRadius(index, total, radius);
    if (radarPointNodes[index]) {
      radarPointNodes[index].setAttribute("cx", point.x);
      radarPointNodes[index].setAttribute("cy", point.y);
    }
    if (radarScoreNodes[index]) {
      radarScoreNodes[index].textContent = `${axis}: ${value}/5`;
    }
    return `${point.x},${point.y}`;
  });
  radarShape.setAttribute("points", points.join(" "));
};

const calculateCombinedAlignment = (baseAlignment = {}, botanicals = []) => {
  const combined = {};
  outcomeAxes.forEach((axis) => {
    let value = getAxisValue(baseAlignment, axis);
    botanicals.forEach((botanical) => {
      value += getAxisValue(botanical.contributions, axis);
    });
    combined[axis] = Math.min(5, value);
  });
  return combined;
};

const updateAlignmentPreview = (selection) => {
  const baseAlignment = selection.baseAlignment || {};
  const botanicals = selection.selectedBotanicals || [];
  renderRadarChart(calculateCombinedAlignment(baseAlignment, botanicals));
};

const initFlavorSpectrum = () => {
  if (!flavorSpectrum || flavorSpectrumReady) {
    return;
  }

  flavorSpectrum.innerHTML = "";
  flavorSpectrumRows = [];

  flavorCategories.forEach((category) => {
    const row = document.createElement("div");
    row.className = "flavor-spectrum-row";

    const label = document.createElement("span");
    label.textContent = category;

    const bar = document.createElement("div");
    bar.className = "flavor-spectrum-bar";
    const fill = document.createElement("span");
    bar.appendChild(fill);

    const score = document.createElement("span");
    score.className = "flavor-spectrum-score";
    score.textContent = "0/5";

    row.appendChild(label);
    row.appendChild(bar);
    row.appendChild(score);

    flavorSpectrum.appendChild(row);
    flavorSpectrumRows.push({ bar: fill, score });
  });

  flavorSpectrumReady = true;
};

const calculateFlavorProfile = (flavors = []) => {
  const profile = {};
  flavorCategories.forEach((category) => {
    profile[category] = 0;
  });

  flavors.forEach((flavor) => {
    const spectrum = flavor.spectrum || {};
    flavorCategories.forEach((category) => {
      profile[category] = Math.min(5, profile[category] + (spectrum[category] || 0));
    });
  });

  return profile;
};

const renderFlavorSpectrum = (profile = {}) => {
  if (!flavorSpectrum) {
    return;
  }

  initFlavorSpectrum();
  flavorCategories.forEach((category, index) => {
    const value = Math.min(5, profile[category] || 0);
    if (flavorSpectrumRows[index]) {
      flavorSpectrumRows[index].bar.style.width = `${value * 20}%`;
      flavorSpectrumRows[index].score.textContent = `${value}/5`;
    }
  });
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

const updateFlavorPreview = (selection) => {
  const flavors = selection.selectedFlavors || [];
  const titles = flavors.map((flavor) => `${flavor.title} (${flavor.category})`);
  updateList(
    previewFlavors,
    titles,
    "Add flavor notes to complete the aroma profile.",
  );
  renderFlavorSpectrum(calculateFlavorProfile(flavors));
};

const resetBasePreview = () => {
  baseCards.forEach((item) => item.classList.remove("is-selected"));
  if (previewBaseTitle) {
    previewBaseTitle.textContent = "Pick a base tea";
  }
  if (previewBaseDescription) {
    previewBaseDescription.textContent =
      "The base tea will steer the balance of calm, focus, and alertness in your blend.";
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

const showFlavorGrid = (outcomeId, baseId) => {
  flavorGrids.forEach((grid) => {
    const isMatch = grid.dataset.flavorGrid === outcomeId;
    grid.hidden = !isMatch || !baseId;
  });
  if (flavorEmpty) {
    flavorEmpty.hidden = Boolean(outcomeId && baseId);
  }

  flavorCards.forEach((card) => {
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

const resetFlavorSelection = () => {
  flavorCards.forEach((item) => item.classList.remove("is-selected"));
  updateFlavorWarning("");
  updateFlavorPreview({ selectedFlavors: [] });
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
  showFlavorGrid(card.dataset.outcomeId, null);
  resetFlavorSelection();

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
    selectedFlavors: [],
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
  showFlavorGrid(selection.outcomeId, selection.baseId);
  selection.selectedBotanicals = reconcileBotanicals(selection);
  selection.selectedFlavors = reconcileFlavors(selection);
  storeSelection(selection);
  updateBotanicalPreview(selection);
  updateFlavorPreview(selection);
  updateFlavorWarning("");
  updateAlignmentPreview(selection);
};

baseCards.forEach((card) => {
  card.addEventListener("click", () => applyBaseSelection(card));
});

const restoreSelection = () => {
  try {
    const selection = getStoredSelection();
    if (!selection.outcomeId) {
      updateFlavorPreview({ selectedFlavors: [] });
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

    if (selection.selectedFlavors) {
      selection.selectedFlavors.forEach((flavor) => {
        const matchFlavor = Array.from(flavorCards).find(
          (card) =>
            card.dataset.flavorId === flavor.id &&
            card.dataset.outcomeId === selection.outcomeId,
        );
        if (matchFlavor) {
          matchFlavor.classList.add("is-selected");
        }
      });
      selection.selectedFlavors = reconcileFlavors(selection);
      storeSelection(selection);
      updateFlavorPreview(selection);
      updateFlavorWarning("");
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

const flavorCardById = new Map();
flavorCards.forEach((card) => {
  if (card.dataset.flavorId) {
    flavorCardById.set(card.dataset.flavorId, card);
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

const isFlavorAllowed = (card, outcomeId, baseId) => {
  if (!card || !outcomeId || !baseId) {
    return false;
  }
  if (card.dataset.outcomeId !== outcomeId) {
    return false;
  }
  const baseIds = (card.dataset.baseIds || "").split(",").filter(Boolean);
  return baseIds.length === 0 || baseIds.includes(baseId);
};

const updateFlavorConflicts = (selection) => {
  const selected = selection.selectedFlavors || [];
  const blocked = new Set();

  selected.forEach((flavor) => {
    (flavor.incompatibleWith || []).forEach((id) => blocked.add(id));
  });

  flavorCards.forEach((card) => {
    const isSelected = selected.some(
      (flavor) => flavor.id === card.dataset.flavorId,
    );
    const isBlocked = blocked.has(card.dataset.flavorId);
    const shouldBlock = !isSelected && isBlocked;
    card.classList.toggle("is-incompatible", shouldBlock);
    card.setAttribute("aria-disabled", shouldBlock ? "true" : "false");
  });
};

const reconcileFlavors = (selection) => {
  const selected = selection.selectedFlavors || [];
  const filtered = [];
  const blocked = new Set();

  selected.forEach((flavor) => {
    const card = flavorCardById.get(flavor.id);
    if (!isFlavorAllowed(card, selection.outcomeId, selection.baseId)) {
      return;
    }
    if (blocked.has(flavor.id)) {
      return;
    }
    filtered.push(flavor);
    (flavor.incompatibleWith || []).forEach((id) => blocked.add(id));
  });

  flavorCards.forEach((card) => {
    const isSelected = filtered.some((flavor) => flavor.id === card.dataset.flavorId);
    card.classList.toggle("is-selected", isSelected);
  });

  updateFlavorConflicts({ selectedFlavors: filtered });
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

const toggleFlavorSelection = (card) => {
  const selection = getStoredSelection();
  if (!selection.baseId) {
    return;
  }

  const existing = selection.selectedFlavors || [];
  const isSelected = card.classList.contains("is-selected");
  let updated = existing;

  if (isSelected) {
    card.classList.remove("is-selected");
    updated = existing.filter((flavor) => flavor.id !== card.dataset.flavorId);
    updateFlavorWarning("");
  } else {
    let incompatibleWith = [];
    if (card.dataset.incompatible) {
      try {
        incompatibleWith = JSON.parse(card.dataset.incompatible);
      } catch (error) {
        console.warn("Unable to read incompatible flavors", error);
      }
    }

    const conflict = existing.find(
      (flavor) =>
        incompatibleWith.includes(flavor.id) ||
        (flavor.incompatibleWith || []).includes(card.dataset.flavorId),
    );
    if (conflict) {
      updateFlavorWarning(
        `${card.dataset.flavorTitle || "This flavor"} clashes with ${conflict.title}.`,
      );
      return;
    }

    let notes = [];
    let spectrum = {};
    if (card.dataset.flavorNotes) {
      try {
        notes = JSON.parse(card.dataset.flavorNotes);
      } catch (error) {
        console.warn("Unable to read flavor notes", error);
      }
    }
    if (card.dataset.flavorSpectrum) {
      try {
        spectrum = JSON.parse(card.dataset.flavorSpectrum);
      } catch (error) {
        console.warn("Unable to read flavor spectrum", error);
      }
    }

    updateFlavorWarning("");
    updated = [
      ...existing,
      {
        id: card.dataset.flavorId,
        title: card.dataset.flavorTitle || "",
        category: card.dataset.flavorCategory || "",
        notes,
        spectrum,
        incompatibleWith,
      },
    ];
  }

  const reconciled = reconcileFlavors({
    ...selection,
    selectedFlavors: updated,
  });
  const nextSelection = {
    ...selection,
    selectedFlavors: reconciled,
  };

  storeSelection(nextSelection);
  updateFlavorPreview(nextSelection);
};

flavorCards.forEach((card) => {
  card.addEventListener("click", () => toggleFlavorSelection(card));
});

restoreSelection();
