const registry = new Map();
let activeFx = null;

export function registerCanvasFx(id, factory) {
  registry.set(id, factory);
}

export function installCanvasFxRuntime() {
  document.addEventListener("deck:slidechange", (event) => {
    activeFx?.stop?.();
    activeFx = null;

    const slide = event.detail.currentSlide;
    const fxId = slide?.dataset?.canvasFx;
    if (!fxId || !registry.has(fxId)) return;

    const canvas = slide.querySelector("canvas.fx-canvas, canvas[data-fx-canvas]");
    if (!canvas) return;

    activeFx = registry.get(fxId)({ canvas, slide });
    activeFx?.start?.();
  });
}

export function stopActiveCanvasFx() {
  activeFx?.stop?.();
  activeFx = null;
}
