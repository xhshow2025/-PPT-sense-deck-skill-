function initDeck() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.querySelector("#counter");
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const speakerBtn = document.querySelector("#speakerBtn");
  const speakerPanel = document.querySelector("#speakerPanel");
  const speakerTitle = document.querySelector("#speakerTitle");
  const speakerNext = document.querySelector("#speakerNext");
  const speakerNotes = document.querySelector("#speakerNotes");
  const timer = document.querySelector("#timer");
  let index = 0;
  let startTime = Date.now();
  let touchStartX = 0;

  function emit(previousIndex) {
    document.dispatchEvent(new CustomEvent("deck:slidechange", {
      detail: {
        index,
        previousIndex,
        currentSlide: slides[index],
        previousSlide: slides[previousIndex]
      }
    }));
  }

  function update() {
    counter.textContent = `${index + 1} / ${slides.length}`;
    const current = slides[index];
    const next = slides[index + 1] || slides[0];
    speakerTitle.textContent = current.dataset.title || "当前页";
    speakerNext.textContent = next.dataset.title || "下一页";
    speakerNotes.textContent = current.querySelector(".notes")?.textContent.trim() || "";
  }

  function go(nextIndex) {
    const previousIndex = index;
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
    update();
    emit(previousIndex);
  }

  function toggleSpeaker() {
    speakerPanel.classList.toggle("on");
    update();
  }

  function updateTimer() {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    requestAnimationFrame(updateTimer);
  }

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));
  speakerBtn.addEventListener("click", toggleSpeaker);
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "Home") go(0);
    if (event.key === "End") go(slides.length - 1);
    if (event.key.toLowerCase() === "s") toggleSpeaker();
    if (event.key.toLowerCase() === "r") startTime = Date.now();
    if (event.key === "Escape" && speakerPanel.classList.contains("on")) toggleSpeaker();
  });
  document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", (event) => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 64) go(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });

  go(0);
  updateTimer();
}

initDeck();
