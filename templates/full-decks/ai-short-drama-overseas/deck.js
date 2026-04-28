const slides = Array.from(document.querySelectorAll(".slide"));
const counter = document.querySelector("#counter");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const speakerBtn = document.querySelector("#speakerBtn");
const gestureBtn = document.querySelector("#gestureBtn");
const speakerPanel = document.querySelector("#speakerPanel");
const speakerTitle = document.querySelector("#speakerTitle");
const speakerNext = document.querySelector("#speakerNext");
const speakerNotes = document.querySelector("#speakerNotes");
const timer = document.querySelector("#timer");
const gestureHud = document.querySelector("#gestureHud");
const gestureStatus = document.querySelector("#gestureStatus");
const gestureVideo = document.querySelector("#gestureVideo");
const gestureCanvas = document.querySelector("#gestureCanvas");

let index = 0;
let startTime = Date.now();
let speakerOpen = false;
let gestureOn = false;
let gestureStream = null;
let previousFrame = null;
let lastGestureAt = 0;
let touchStartX = 0;

function go(nextIndex) {
  index = Math.max(0, Math.min(slides.length - 1, nextIndex));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });
  updateUi();
}

function updateUi() {
  counter.textContent = `${index + 1} / ${slides.length}`;
  const current = slides[index];
  const next = slides[index + 1] || slides[0];
  speakerTitle.textContent = current.dataset.title || "当前页";
  speakerNext.textContent = next.dataset.title || "下一页";
  speakerNotes.textContent = current.querySelector(".notes")?.textContent.trim() || "";
}

function toggleSpeaker() {
  speakerOpen = !speakerOpen;
  speakerPanel.classList.toggle("on", speakerOpen);
  speakerPanel.setAttribute("aria-hidden", String(!speakerOpen));
  updateUi();
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  timer.textContent = `${mm}:${ss}`;
  requestAnimationFrame(updateTimer);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") go(index + 1);
  if (event.key === "ArrowLeft") go(index - 1);
  if (event.key === "Home") go(0);
  if (event.key === "End") go(slides.length - 1);
  if (event.key.toLowerCase() === "s") toggleSpeaker();
  if (event.key.toLowerCase() === "g") toggleGesture();
  if (event.key.toLowerCase() === "r") startTime = Date.now();
  if (event.key === "Escape" && speakerOpen) toggleSpeaker();
});

prevBtn.addEventListener("click", () => go(index - 1));
nextBtn.addEventListener("click", () => go(index + 1));
speakerBtn.addEventListener("click", toggleSpeaker);
gestureBtn.addEventListener("click", () => toggleGesture());

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 64) return;
  go(dx < 0 ? index + 1 : index - 1);
}, { passive: true });

async function toggleGesture() {
  if (gestureOn) {
    stopGesture();
    return;
  }
  gestureOn = true;
  gestureHud.classList.add("on");
  gestureStatus.textContent = "Gesture: requesting camera";
  try {
    gestureStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: "user" },
      audio: false
    });
    gestureVideo.srcObject = gestureStream;
    await gestureVideo.play();
    gestureStatus.textContent = "Gesture: tracking";
    previousFrame = null;
    requestAnimationFrame(readGestureFrame);
  } catch (error) {
    gestureStatus.textContent = "Gesture: unavailable";
  }
}

function stopGesture() {
  gestureOn = false;
  gestureHud.classList.remove("on");
  gestureStatus.textContent = "Gesture: off";
  previousFrame = null;
  if (gestureStream) {
    gestureStream.getTracks().forEach((track) => track.stop());
    gestureStream = null;
  }
}

function readGestureFrame() {
  if (!gestureOn || !gestureVideo.videoWidth) return;
  const canvas = gestureCanvas;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = 96;
  canvas.height = 72;
  ctx.drawImage(gestureVideo, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (previousFrame) {
    let leftMotion = 0;
    let rightMotion = 0;
    for (let y = 0; y < canvas.height; y += 3) {
      for (let x = 0; x < canvas.width; x += 3) {
        const offset = (y * canvas.width + x) * 4;
        const diff =
          Math.abs(frame.data[offset] - previousFrame.data[offset]) +
          Math.abs(frame.data[offset + 1] - previousFrame.data[offset + 1]) +
          Math.abs(frame.data[offset + 2] - previousFrame.data[offset + 2]);
        if (diff > 68) {
          if (x < canvas.width / 2) leftMotion += diff;
          else rightMotion += diff;
        }
      }
    }
    const now = Date.now();
    const total = leftMotion + rightMotion;
    const balance = rightMotion - leftMotion;
    if (total > 52000 && Math.abs(balance) > 18000 && now - lastGestureAt > 900) {
      lastGestureAt = now;
      if (balance > 0) go(index + 1);
      else go(index - 1);
    }
  }
  previousFrame = frame;
  requestAnimationFrame(readGestureFrame);
}

function runAmbientCanvas() {
  const canvas = document.querySelector("#ambientCanvas");
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 52 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 1 + Math.random() * 2.5,
    vx: -0.0004 + Math.random() * 0.0008,
    vy: -0.0003 + Math.random() * 0.0006,
    hue: Math.random()
  }));

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      const x = p.x * canvas.width;
      const y = p.y * canvas.height;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, p.r * 28 * devicePixelRatio);
      const color = p.hue > 0.66 ? "116,216,255" : p.hue > 0.33 ? "121,242,201" : "255,115,183";
      grad.addColorStop(0, `rgba(${color},0.22)`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, p.r * 28 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

go(0);
updateTimer();
runAmbientCanvas();
