const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const speakerBtn = document.querySelector("#speakerBtn");
const counter = document.querySelector("#counter");
const progressBar = document.querySelector("#progressBar");
const speakerPanel = document.querySelector("#speakerPanel");
const speakerTitle = document.querySelector("#speakerTitle");
const speakerNext = document.querySelector("#speakerNext");
const speakerNotes = document.querySelector("#speakerNotes");
const timer = document.querySelector("#timer");

let current = 0;
const start = Date.now();

function showSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === current);
  });

  const active = slides[current];
  const next = slides[current + 1];
  const notes = active.querySelector(".notes");
  counter.textContent = `${current + 1} / ${slides.length}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  speakerTitle.textContent = active.dataset.title || "";
  speakerNext.textContent = next?.dataset.title || "结束";
  speakerNotes.textContent = notes?.textContent?.trim() || "无备注";
  document.title = `${current + 1}. ${active.dataset.title || "Deck"}`;
}

function nextSlide() {
  showSlide(current + 1);
}

function prevSlide() {
  showSlide(current - 1);
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);
speakerBtn.addEventListener("click", () => {
  speakerPanel.classList.toggle("open");
});

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    nextSlide();
  }
  if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    prevSlide();
  }
  if (event.key.toLowerCase() === "s") {
    speakerPanel.classList.toggle("open");
  }
  if (event.key === "Home") {
    showSlide(0);
  }
  if (event.key === "End") {
    showSlide(slides.length - 1);
  }
});

let touchStartX = null;
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 48) {
    delta < 0 ? nextSlide() : prevSlide();
  }
  touchStartX = null;
}, { passive: true });

setInterval(() => {
  const elapsed = Math.floor((Date.now() - start) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
}, 1000);

showSlide(0);
