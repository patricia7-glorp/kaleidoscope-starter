(function () {
  const canvas = document.getElementById("starfield");
  const context = canvas.getContext("2d");
  const stars = [];
  const pointer = { x: 0, y: 0, active: false };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colors = ["#ff4f9a", "#ff79b7", "#ed3f88", "#ffb0d2", "#fff0f7"];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let previousTime = 0;

  function makeStar(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -8,
      size: 2 + Math.random() * 3,
      speed: 18 + Math.random() * 38,
      drift: (Math.random() - 0.5) * 9,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.7 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.max(55, Math.min(220, Math.round((width * height) / 4500)));
    stars.length = 0;
    for (let i = 0; i < count; i++) stars.push(makeStar(true));
  }

  function drawStar(star, time) {
    const twinkle = 0.78 + 0.22 * Math.sin(time * star.twinkleSpeed + star.phase);
    const radius = star.size;

    context.globalAlpha = twinkle;
    context.fillStyle = star.color;
    context.shadowColor = star.color;
    context.shadowBlur = radius * 3;
    context.beginPath();
    context.moveTo(star.x, star.y - radius);
    context.lineTo(star.x + radius * 0.28, star.y - radius * 0.28);
    context.lineTo(star.x + radius, star.y);
    context.lineTo(star.x + radius * 0.28, star.y + radius * 0.28);
    context.lineTo(star.x, star.y + radius);
    context.lineTo(star.x - radius * 0.28, star.y + radius * 0.28);
    context.lineTo(star.x - radius, star.y);
    context.lineTo(star.x - radius * 0.28, star.y - radius * 0.28);
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
  }

  function animate(timestamp) {
    const delta = Math.min((timestamp - previousTime) / 1000 || 0, 0.05);
    const time = timestamp / 1000;
    previousTime = timestamp;
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (pointer.active) {
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = 110;
        if (distance > 0 && distance < radius) {
          const force = (1 - distance / radius) * 240;
          star.vx += (dx / distance) * force * delta;
          star.vy += (dy / distance) * force * delta;
        }
      }

      const motionScale = reducedMotion.matches ? 0.35 : 1;
      const damping = Math.pow(0.08, delta);
      star.vx *= damping;
      star.vy *= damping;
      star.x += (star.drift + star.vx) * delta * motionScale;
      star.y += (star.speed + star.vy) * delta * motionScale;

      if (star.y > height + 8 || star.x < -8 || star.x > width + 8) {
        Object.assign(star, makeStar(false));
      }
      drawStar(star, time);
    }

    context.globalAlpha = 1;
    window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", function () {
    pointer.active = false;
  });

  resize();
  window.requestAnimationFrame(animate);
}());
