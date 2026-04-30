export function installSlideLifecycle({ getSlides = defaultSlides, getIndex = defaultIndex } = {}) {
  const slides = getSlides();
  let activeIndex = getIndex(slides);

  function emit(nextIndex, previousIndex = activeIndex) {
    const detail = {
      index: nextIndex,
      previousIndex,
      currentSlide: slides[nextIndex],
      previousSlide: slides[previousIndex]
    };
    activeIndex = nextIndex;
    document.dispatchEvent(new CustomEvent("deck:slidechange", { detail }));
  }

  if (globalThis.Reveal?.on) {
    globalThis.Reveal.on("slidechanged", (event) => {
      const nextIndex = slides.indexOf(event.currentSlide);
      const previousIndex = slides.indexOf(event.previousSlide);
      emit(Math.max(0, nextIndex), Math.max(0, previousIndex));
    });
  }

  emit(activeIndex, activeIndex);
  return { emit };
}

function defaultSlides() {
  return Array.from(document.querySelectorAll(".slide, .slides section"));
}

function defaultIndex(slides) {
  return Math.max(0, slides.findIndex((slide) => slide.classList.contains("active") || slide.classList.contains("present")));
}

