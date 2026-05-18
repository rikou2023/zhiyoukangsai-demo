document.body.insertAdjacentHTML("afterbegin", '<canvas class="ambient-canvas" id="subAmbientCanvas"></canvas>');

const subCanHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (subCanHover) document.querySelectorAll(".visual, .card, .list span, .feature-band div, .advantage-matrix, .matrix-col").forEach((card) => {
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;

  function animate() {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    card.style.setProperty("--shine-x", `${currentX}px`);
    card.style.setProperty("--shine-y", `${currentY}px`);
    card.style.setProperty("--shine-tx", `${(currentX - card.offsetWidth / 2) * 0.012}px`);
    card.style.setProperty("--shine-ty", `${(currentY - card.offsetHeight / 2) * 0.01}px`);
    if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
      raf = requestAnimationFrame(animate);
    } else {
      raf = 0;
    }
  }

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    if (!raf) raf = requestAnimationFrame(animate);
  }, { passive: true });
});

(function subAmbientField() {
  const canvas = document.getElementById("subAmbientCanvas");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let strands = [];
  let nodes = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 760 ? 6 : 11;
    strands = Array.from({ length: count }, (_, index) => ({
      y: height * (.14 + index / (count + 2) * .78),
      amp: 18 + Math.random() * 36,
      speed: .4 + Math.random() * .36,
      phase: Math.random() * Math.PI * 2,
      hue: index % 3 === 0 ? "85,213,255" : index % 3 === 1 ? "106,166,255" : "167,139,250"
    }));
    const nodeCount = width < 760 ? 36 : 72;
    nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.1 + .45
    }));
  }

  function draw() {
    time += .006;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    strands.forEach((strand, index) => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${strand.hue},0)`);
      gradient.addColorStop(.45, `rgba(${strand.hue},${width < 760 ? .13 : .19})`);
      gradient.addColorStop(.78, `rgba(${strand.hue},${width < 760 ? .07 : .12})`);
      gradient.addColorStop(1, `rgba(${strand.hue},0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = index % 3 === 0 ? 1.1 : .7;
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 24) {
        const y = strand.y
          + Math.sin(x * .006 + time * strand.speed + strand.phase) * strand.amp
          + Math.cos(x * .0025 + time * .7) * strand.amp * .42;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let dot = 0; dot < 3; dot++) {
        const progress = (time * strand.speed * .08 + dot / 3 + index * .09) % 1;
        const x = progress * width;
        const y = strand.y + Math.sin(x * .006 + time * strand.speed + strand.phase) * strand.amp;
        ctx.fillStyle = `rgba(${strand.hue},.5)`;
        ctx.beginPath();
        ctx.arc(x, y, width < 760 ? 1.2 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });
    const connectDist = width < 760 ? 104 : 148;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < connectDist) {
          ctx.strokeStyle = `rgba(105,180,255,${(.16 * (1 - dist / connectDist)).toFixed(3)})`;
          ctx.lineWidth = .55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach((node) => {
      ctx.fillStyle = "rgba(117,221,255,.48)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
})();
