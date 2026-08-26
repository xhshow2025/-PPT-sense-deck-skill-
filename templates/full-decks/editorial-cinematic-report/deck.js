import { installEditMode } from "../../runtime/edit-mode.js";

const slides = Array.from(document.querySelectorAll(".slide"));
const counter = document.querySelector("#counter");
const prevButton = document.querySelector("#prevBtn");
const nextButton = document.querySelector("#nextBtn");
const speakerButton = document.querySelector("#speakerBtn");
const editButton = document.querySelector("#editBtn");
const speakerPanel = document.querySelector("#speakerPanel");
const speakerTitle = document.querySelector("#speakerTitle");
const speakerNext = document.querySelector("#speakerNext");
const speakerNotes = document.querySelector("#speakerNotes");
const timer = document.querySelector("#timer");

let index = 0;
let touchStartX = 0;
let startTime = Date.now();

const editMode = installEditMode({
  root: document,
  storageKey: `${location.pathname}:editorial-cinematic-report`
});

function emitSlideChange(previousIndex) {
  document.dispatchEvent(new CustomEvent("deck:slidechange", {
    detail: {
      index,
      previousIndex,
      currentSlide: slides[index],
      previousSlide: slides[previousIndex]
    }
  }));
}

function updatePresenter() {
  const current = slides[index];
  const next = slides[index + 1] || slides[0];
  counter.textContent = `${index + 1} / ${slides.length}`;
  speakerTitle.textContent = current.dataset.title || "当前页";
  speakerNext.textContent = next.dataset.title || "下一页";
  speakerNotes.textContent = current.querySelector(".notes")?.textContent.trim() || "";
}

function go(nextIndex) {
  const previousIndex = index;
  index = Math.max(0, Math.min(slides.length - 1, nextIndex));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
    slide.setAttribute("aria-hidden", String(slideIndex !== index));
  });
  prevButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
  updatePresenter();
  emitSlideChange(previousIndex);
}

function toggleSpeaker(force) {
  const enabled = typeof force === "boolean" ? force : !speakerPanel.classList.contains("on");
  speakerPanel.classList.toggle("on", enabled);
  speakerPanel.setAttribute("aria-hidden", String(!enabled));
  updatePresenter();
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsText = String(seconds % 60).padStart(2, "0");
  timer.textContent = `${minutesText}:${secondsText}`;
  requestAnimationFrame(updateTimer);
}

prevButton.addEventListener("click", () => go(index - 1));
nextButton.addEventListener("click", () => go(index + 1));
speakerButton.addEventListener("click", () => toggleSpeaker());
editButton.addEventListener("click", () => editMode.toggleEditMode());

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement && event.target.isContentEditable) return;
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") go(index + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") go(index - 1);
  if (event.key === "Home") go(0);
  if (event.key === "End") go(slides.length - 1);
  if (event.key.toLowerCase() === "s") toggleSpeaker();
  if (event.key.toLowerCase() === "r") startTime = Date.now();
  if (event.key === "Escape") toggleSpeaker(false);
});

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 64) go(distance < 0 ? index + 1 : index - 1);
}, { passive: true });

go(0);
updateTimer();
