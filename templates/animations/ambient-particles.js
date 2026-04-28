export function runAmbientParticles(canvasSelector = "#ambientCanvas") {
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) return;
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
