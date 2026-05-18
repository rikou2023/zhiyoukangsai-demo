/* 智优康赛首页交互
   依赖：无第三方库（纯原生 JS）
*/

(function () {
  'use strict';

  /* ============================================
     0. 配色主题切换（QA 工具 · 上线前删除）
     ============================================ */
  // 客户已拍板用 M
  document.documentElement.setAttribute('data-theme', 'M');

  /* ============================================
     背景特效管理（6 套 + 无）
     ============================================ */
  const FX_KEY = 'zykys-fx';
  const fxBtns = document.querySelectorAll('.fx-btn');
  let neuralRAF = null;
  let starsRAF = null;
  let spotlightHandler = null;

  function stopAllAnimations() {
    if (neuralRAF) { cancelAnimationFrame(neuralRAF); neuralRAF = null; }
    if (starsRAF) { cancelAnimationFrame(starsRAF); starsRAF = null; }
    if (spotlightHandler) {
      document.removeEventListener('mousemove', spotlightHandler);
      spotlightHandler = null;
    }
  }

  function applyFx(name) {
    stopAllAnimations();
    document.body.setAttribute('data-fx', name);
    if (name === 'neural') startNeural();
    if (name === 'stars') startStars();
    if (name === 'spotlight') startSpotlight();
    fxBtns.forEach((b) => b.classList.toggle('active', b.dataset.fx === name));
    localStorage.setItem(FX_KEY, name);
  }

  /* ---- 鼠标聚光灯（设 CSS 变量） ---- */
  function startSpotlight() {
    spotlightHandler = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    };
    document.addEventListener('mousemove', spotlightHandler);
  }

  /* ---- 神经网络节点 + 连线
     - 节点数 70
     - 鼠标 180px 范围内的节点会被"吸引"靠拢（不是全部）
     - 远处节点保持自然漂浮
  ---- */
  function startNeural() {
    const canvas = document.getElementById('canvas-neural');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const accent = getCSSColor('--accent');
    let W, H, nodes;
    const NODE_COUNT = 70;
    const LINK_DIST = 150;
    const ATTRACT_DIST = 180;
    const ATTRACT_FORCE = 0.05;
    const DAMPING = 0.985;
    const MAX_SPEED = 1.2;
    let mouseX = -9999, mouseY = -9999;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      W = rect.width; H = rect.height;
    }
    function init() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 1.6
      }));
    }
    function onMouseMove(e) {
      // 监听全局鼠标位置（Hero 范围内有效）
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouseX = -9999; mouseY = -9999;
    }
    function step() {
      ctx.clearRect(0, 0, W, H);

      // 更新位置：鼠标附近的节点被吸引，远的保持自然漂浮
      nodes.forEach((n) => {
        const dxm = mouseX - n.x;
        const dym = mouseY - n.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < ATTRACT_DIST && distM > 1) {
          // 吸引力：距离越近力越强
          const factor = (1 - distM / ATTRACT_DIST) * ATTRACT_FORCE;
          n.vx += (dxm / distM) * factor;
          n.vy += (dym / distM) * factor;
        }
        // 阻尼防止越跑越快
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        // 阻尼后给个最小自然漂浮，避免完全静止
        if (Math.abs(n.vx) < 0.04) n.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(n.vy) < 0.04) n.vy += (Math.random() - 0.5) * 0.08;
        // 限速
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > MAX_SPEED) {
          n.vx = (n.vx / speed) * MAX_SPEED;
          n.vy = (n.vy / speed) * MAX_SPEED;
        }
        // 应用位移
        n.x += n.vx;
        n.y += n.vy;
        // 边界反弹
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > W) { n.x = W; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > H) { n.y = H; n.vy *= -1; }
      });

      // 连线
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const a = (1 - dist / LINK_DIST) * 0.4;
            ctx.strokeStyle = `${accent}${Math.floor(a * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 画节点（鼠标附近的高亮）
      nodes.forEach((n) => {
        const dxm = n.x - mouseX, dym = n.y - mouseY;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        const boost = distM < ATTRACT_DIST ? (1 - distM / ATTRACT_DIST) * 2 : 0;
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.5 + boost * 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + boost, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      neuralRAF = requestAnimationFrame(step);
    }
    resize(); init();
    // 监听整个文档的鼠标位置（不止 canvas 区，因为 canvas pointer-events:none）
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => { resize(); init(); });
    step();
  }

  /* ---- 星尘漂浮（加密 + 加速） ---- */
  function startStars() {
    const canvas = document.getElementById('canvas-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars;
    const COUNT = 220;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      W = rect.width; H = rect.height;
    }
    function init() {
      stars = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.4 + Math.pow(Math.random(), 2) * 2.4,
        a: Math.random() * Math.PI * 2,
        ds: 0.01 + Math.random() * 0.025,             // 闪烁慢一点
        vy: 0.05 + Math.random() * 0.25,              // 下落速度 0.05-0.3（雪花漂落感）
        vx: (Math.random() - 0.5) * 0.12              // 轻微左右漂移
      }));
    }
    function step() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.y += s.vy;
        s.x += s.vx;
        s.a += s.ds;
        // 边界处理
        if (s.y > H + 5) { s.y = -5; s.x = Math.random() * W; }
        if (s.x < -5) s.x = W + 5;
        if (s.x > W + 5) s.x = -5;
        const alpha = 0.4 + Math.sin(s.a) * 0.5;
        // 大的星星加发光
        if (s.r > 1.5) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      starsRAF = requestAnimationFrame(step);
    }
    resize(); init();
    window.addEventListener('resize', () => { resize(); init(); });
    step();
  }

  function getCSSColor(varName) {
    const s = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return s || '#2F66FF';
  }

  /* ---- 切换按钮 ---- */
  fxBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFx(btn.dataset.fx));
  });

  // 客户已选神经网络 — 强制默认
  applyFx('neural');

  /* ============================================
     1. Header 滚动状态
     ============================================ */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================
     2. Hero 主标题 AI 平台 Logo + 名字 轮换
     ============================================ */
  const platformRotator = document.querySelector('.platform-rotator');
  if (platformRotator) {
    // 国内主流 AI 平台（客户要求只展示国内）
    const platforms = [
      ['Kimi',     'images/Kimi.png'],
      ['豆包',     'images/豆包.png'],
      ['文心一言', 'images/文心一言.png'],
      ['DeepSeek', 'images/DeepSeek.png'],
      ['通义千问', 'images/通义千问.png'],
      ['元宝',     'images/腾讯元宝.png'],
      ['智谱清言', 'images/智谱清言.png']
    ];

    const iconEl = platformRotator.querySelector('.platform-icon');
    const nameEl = platformRotator.querySelector('.platform-name');
    let idx = 0;

    const rotate = () => {
      idx = (idx + 1) % platforms.length;
      const [name, icon] = platforms[idx];

      // 淡出 → 换内容 → 淡入
      platformRotator.classList.add('swapping');
      setTimeout(() => {
        nameEl.textContent = name;
        if (icon) {
          iconEl.src = icon;
          iconEl.style.display = '';
        } else {
          iconEl.style.display = 'none';
        }
        platformRotator.classList.remove('swapping');
      }, 200);
    };

    setInterval(rotate, 2800);
  }

  /* ============================================
     3. Hero 系统截图轮播
     ============================================ */
  const showcase = document.querySelector('.showcase-frame');
  if (showcase) {
    const slides = Array.from(showcase.querySelectorAll('.showcase-slide'));
    const dots = Array.from(document.querySelectorAll('.showcase-dot'));
    let active = 0;
    let timer = null;
    const INTERVAL = 5000;

    const goTo = (i) => {
      slides[active].classList.remove('active');
      dots[active]?.classList.remove('active');
      active = (i + slides.length) % slides.length;
      slides[active].classList.add('active');
      dots[active]?.classList.add('active');
    };

    const next = () => goTo(active + 1);

    const start = () => {
      stop();
      timer = setInterval(next, INTERVAL);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        start();
      });
    });

    // 悬停暂停
    showcase.addEventListener('mouseenter', stop);
    showcase.addEventListener('mouseleave', start);

    // 用 IntersectionObserver 只在可视时跑
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.2 });
      io.observe(showcase);
    } else {
      start();
    }
  }

  /* ============================================
     4. 移动端 Hamburger（占位，后续接入侧边抽屉）
     ============================================ */
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      // 抽屉逻辑后续在 mobile-nav.js 加
    });
  }
})();
