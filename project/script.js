"use strict";

const cards = document.querySelectorAll(".collection-card");
const filterButtons = document.querySelectorAll(".filter-button");
const detailsPanel = document.querySelector("#details-panel");
const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");
const visibleCount = document.querySelector("#visible-count");
const randomButton = document.querySelector("#random-button");
const resetButton = document.querySelector("#reset-button");
const historyList = document.querySelector("#history-list");
const historyEmpty = document.querySelector("#history-empty");

const initialTitle = detailsTitle.textContent;
const initialDescription = detailsDescription.textContent.trim();

let selectedCard = null;
let selectionHistory = [];

function clearSelection() {
  cards.forEach((card) => {
    card.classList.remove("collection-card--selected");
    card.setAttribute("aria-pressed", "false");
  });

  selectedCard = null;
  detailsTitle.textContent = initialTitle;
  detailsDescription.textContent = initialDescription;
}

function renderHistory() {
  historyList.innerHTML = "";

  selectionHistory.forEach((title) => {
    const historyItem = document.createElement("li");

    historyItem.classList.add("history__item");
    historyItem.textContent = title;

    historyList.append(historyItem);
  });

  historyEmpty.hidden = selectionHistory.length > 0;
}

function addToHistory(card) {
  const title = card.dataset.title;

  selectionHistory = selectionHistory.filter((item) => item !== title);

  selectionHistory.unshift(title);

  selectionHistory = selectionHistory.slice(0, 3);

  renderHistory();
}

function clearHistory() {
  selectionHistory = [];
  renderHistory();
}

function selectCard(card) {
  cards.forEach((item) => {
    item.classList.remove("collection-card--selected");
    item.setAttribute("aria-pressed", "false");
  });

  card.classList.add("collection-card--selected");
  card.setAttribute("aria-pressed", "true");

  selectedCard = card;

  detailsTitle.textContent = card.dataset.title;
  detailsDescription.textContent = card.dataset.description;

  addToHistory(card);

  detailsPanel.classList.remove("details-panel--pulse");

  requestAnimationFrame(() => {
    detailsPanel.classList.add("details-panel--pulse");
  });
}

function applyFilter(filter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;

    button.classList.toggle("filter-button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  let count = 0;

  cards.forEach((card) => {
    const shouldShow =
      filter === "all" || card.dataset.category === filter;

    card.classList.toggle(
      "collection-card--hidden",
      !shouldShow,
    );

    if (shouldShow) {
      count = count + 1;
    }
  });

  visibleCount.textContent = count;

  if (
    selectedCard &&
    selectedCard.classList.contains("collection-card--hidden")
  ) {
    clearSelection();
  }
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    selectCard(card);
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter);
  });
});

randomButton.addEventListener("click", () => {
  const visibleCards = Array.from(cards).filter(
    (card) =>
      !card.classList.contains("collection-card--hidden"),
  );

  let availableCards = visibleCards;

  if (selectedCard && visibleCards.length > 1) {
    availableCards = visibleCards.filter(
      (card) => card !== selectedCard,
    );
  }

  const randomIndex = Math.floor(
    Math.random() * availableCards.length,
  );

  selectCard(availableCards[randomIndex]);
});

resetButton.addEventListener("click", () => {
  applyFilter("all");
  clearSelection();
  clearHistory();

  detailsPanel.classList.remove("details-panel--pulse");
});