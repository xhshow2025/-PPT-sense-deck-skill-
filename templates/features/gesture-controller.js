export function createGestureController({
  mode = "off",
  onNext = () => {},
  onPrev = () => {},
  statusEl = null,
  videoEl = null,
  canvasEl = null
} = {}) {
  if (mode === "mediapipe-hand") {
    return createMediapipePlaceholder({ onNext, onPrev, statusEl });
  }
  if (mode === "motion-lite") {
    return createMotionLiteController({ onNext, onPrev, statusEl, videoEl, canvasEl });
  }
  return createOffController(statusEl);
}

function createOffController(statusEl) {
  return {
    async start() {
      if (statusEl) statusEl.textContent = "Gesture: off";
    },
    stop() {
      if (statusEl) statusEl.textContent = "Gesture: off";
    }
  };
}

function createMotionLiteController({ onNext, onPrev, statusEl, videoEl, canvasEl }) {
  let stream = null;
  let previousFrame = null;
  let lastGestureAt = 0;
  let running = false;

  async function start() {
    if (!videoEl || !canvasEl) throw new Error("motion-lite gesture mode needs videoEl and canvasEl");
    if (statusEl) statusEl.textContent = "Gesture: requesting camera";
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: "user" },
      audio: false
    });
    videoEl.srcObject = stream;
    await videoEl.play();
    running = true;
    if (statusEl) statusEl.textContent = "Gesture: tracking";
    requestAnimationFrame(readFrame);
  }

  function stop() {
    running = false;
    previousFrame = null;
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    if (statusEl) statusEl.textContent = "Gesture: off";
  }

  function readFrame() {
    if (!running || !videoEl.videoWidth) return;
    const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
    canvasEl.width = 96;
    canvasEl.height = 72;
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);

    if (previousFrame) {
      let leftMotion = 0;
      let rightMotion = 0;
      for (let y = 0; y < canvasEl.height; y += 3) {
        for (let x = 0; x < canvasEl.width; x += 3) {
          const offset = (y * canvasEl.width + x) * 4;
          const diff =
            Math.abs(frame.data[offset] - previousFrame.data[offset]) +
            Math.abs(frame.data[offset + 1] - previousFrame.data[offset + 1]) +
            Math.abs(frame.data[offset + 2] - previousFrame.data[offset + 2]);
          if (diff > 68) {
            if (x < canvasEl.width / 2) leftMotion += diff;
            else rightMotion += diff;
          }
        }
      }
      const now = Date.now();
      const total = leftMotion + rightMotion;
      const balance = rightMotion - leftMotion;
      if (total > 52000 && Math.abs(balance) > 18000 && now - lastGestureAt > 900) {
        lastGestureAt = now;
        if (balance > 0) onNext();
        else onPrev();
      }
    }

    previousFrame = frame;
    requestAnimationFrame(readFrame);
  }

  return { start, stop };
}

function createMediapipePlaceholder({ statusEl }) {
  return {
    async start() {
      if (statusEl) statusEl.textContent = "Gesture: mediapipe-hand not bundled";
      throw new Error("mediapipe-hand mode requires adding @mediapipe/tasks-vision and a hand landmarker adapter");
    },
    stop() {
      if (statusEl) statusEl.textContent = "Gesture: off";
    }
  };
}

