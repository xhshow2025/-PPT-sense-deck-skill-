import { registerCanvasFx } from "../runtime/canvas-fx-runtime.js";

function createLoop(canvas, draw) {
  const ctx = canvas.getContext("2d");
  let frame = 0;
  let raf = 0;
  let running = false;

  function resize() {
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth || window.innerWidth) * devicePixelRatio);
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight || window.innerHeight) * devicePixelRatio);
  }

  function tick() {
    if (!running) return;
    frame += 1;
    draw({ ctx, canvas, frame });
    raf = requestAnimationFrame(tick);
  }

  return {
    start() {
      running = true;
      resize();
      window.addEventListener("resize", resize);
      tick();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}

function particles({ canvas }) {
  const dots = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: -0.0005 + Math.random() * 0.001,
    vy: -0.0004 + Math.random() * 0.0008,
    r: 1 + Math.random() * 2.4
  }));
  return createLoop(canvas, ({ ctx, canvas }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((p) => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      ctx.beginPath();
      ctx.fillStyle = "rgba(116,216,255,0.32)";
      ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function networkNodes({ canvas }) {
  const nodes = Array.from({ length: 36 }, () => ({ x: Math.random(), y: Math.random(), vx: -0.0006 + Math.random() * 0.0012, vy: -0.0006 + Math.random() * 0.0012 }));
  return createLoop(canvas, ({ ctx, canvas }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((n) => {
      n.x = (n.x + n.vx + 1) % 1;
      n.y = (n.y + n.vy + 1) % 1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = (nodes[i].x - nodes[j].x) * canvas.width;
        const dy = (nodes[i].y - nodes[j].y) * canvas.height;
        const d = Math.hypot(dx, dy);
        if (d < 170 * devicePixelRatio) {
          ctx.strokeStyle = `rgba(121,242,201,${0.18 * (1 - d / (170 * devicePixelRatio))})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x * canvas.width, nodes[i].y * canvas.height);
          ctx.lineTo(nodes[j].x * canvas.width, nodes[j].y * canvas.height);
          ctx.stroke();
        }
      }
    }
  });
}

function dataStream({ canvas }) {
  const lanes = Array.from({ length: 18 }, (_, i) => ({ y: (i + 1) / 20, offset: Math.random() }));
  return createLoop(canvas, ({ ctx, canvas, frame }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lanes.forEach((lane) => {
      const x = ((frame * 0.006 + lane.offset) % 1) * canvas.width;
      ctx.strokeStyle = "rgba(116,216,255,0.22)";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, x - 180 * devicePixelRatio), lane.y * canvas.height);
      ctx.lineTo(x, lane.y * canvas.height);
      ctx.stroke();
    });
  });
}

function matrixRain({ canvas }) {
  const glyphs = "01AI数据模型增长";
  let columns = [];
  return createLoop(canvas, ({ ctx, canvas }) => {
    const size = 18 * devicePixelRatio;
    if (columns.length !== Math.ceil(canvas.width / size)) {
      columns = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * canvas.height);
    }
    ctx.fillStyle = "rgba(8,9,18,0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(113,255,231,0.72)";
    ctx.font = `${size}px monospace`;
    columns.forEach((y, i) => {
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y);
      columns[i] = y > canvas.height + 40 ? 0 : y + size;
    });
  });
}

function fluidWaves({ canvas }) {
  return createLoop(canvas, ({ ctx, canvas, frame }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let layer = 0; layer < 4; layer++) {
      ctx.beginPath();
      const yBase = canvas.height * (0.42 + layer * 0.08);
      for (let x = 0; x <= canvas.width; x += 16 * devicePixelRatio) {
        const y = yBase + Math.sin(x * 0.006 + frame * 0.018 + layer) * 28 * devicePixelRatio;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${layer % 2 ? "121,242,201" : "116,216,255"},${0.22 - layer * 0.035})`;
      ctx.lineWidth = (3 - layer * 0.35) * devicePixelRatio;
      ctx.stroke();
    }
  });
}

function waveform({ canvas }) {
  return createLoop(canvas, ({ ctx, canvas, frame }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 64;
    const w = canvas.width / bars;
    for (let i = 0; i < bars; i++) {
      const amp = (Math.sin(i * 0.45 + frame * 0.08) + Math.sin(i * 0.16 + frame * 0.035) + 2) / 4;
      const h = amp * canvas.height * 0.42;
      ctx.fillStyle = `rgba(255,177,92,${0.2 + amp * 0.45})`;
      ctx.fillRect(i * w, canvas.height / 2 - h / 2, Math.max(2, w * 0.46), h);
    }
  });
}

export function registerDefaultCanvasFx() {
  registerCanvasFx("particles", particles);
  registerCanvasFx("network-nodes", networkNodes);
  registerCanvasFx("data-stream", dataStream);
  registerCanvasFx("matrix-rain", matrixRain);
  registerCanvasFx("fluid-waves", fluidWaves);
  registerCanvasFx("waveform", waveform);
}
