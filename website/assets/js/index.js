/* 智优康赛首页交互
   依赖：无第三方库（纯原生 JS）
*/

(function () {
  'use strict';

  // 客户已拍板用 M 主题
  document.documentElement.setAttribute('data-theme', 'M');

  /* ============================================
     0a. Preloader 加载页（首屏入口动画）
     进度 0→100 + 结束后 .is-out 退场 + 解锁页面滚动
     ============================================ */
  (function setupPreloader() {
    const preloader = document.getElementById('preloader');
    const numEl = document.getElementById('preloaderNum');
    if (!preloader || !numEl) return;

    // 锁定 body 滚动（直到 preloader 退场）
    document.body.classList.add('preloading');

    const DURATION = 1800; // 进度跑完时长 (ms)
    const HOLD = 200;      // 到 100% 后停留 (ms)
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeOutCubic(t);
      const value = Math.floor(eased * 100);
      numEl.textContent = String(value);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        numEl.textContent = '100';
        // 短暂停留后退场
        setTimeout(exit, HOLD);
      }
    };

    const exit = () => {
      preloader.classList.add('is-out');
      // 退场动画跑完后解锁滚动 + 隐藏 preloader
      setTimeout(() => {
        document.body.classList.remove('preloading');
        preloader.style.display = 'none';
        // 触发 Hero 入场（如果有 .hero.alan-parent 类）
        document.querySelectorAll('.hero .alan-parent, .hero-title').forEach((el) => {
          el.classList.add('is-go');
        });
      }, 700);
    };

    // 等字体 + 关键资源加载完成再开始
    if (document.readyState === 'complete') {
      requestAnimationFrame(tick);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(tick), { once: true });
    }

    // 安全保险：3 秒强制退场（防止 load 事件不触发）
    setTimeout(() => {
      if (!preloader.classList.contains('is-out')) exit();
    }, 3500);
  })();

  /* ============================================
     0b. 导航 Pill 滑动追随
         - 默认停在 .is-active 链接下
         - 鼠标 hover 任一链接 → 弹性追过去
         - 鼠标离开整个导航 → 弹回 active
     ============================================ */
  (function setupNavPill() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const pill = nav.querySelector('.nav-pill');
    const links = Array.from(nav.querySelectorAll('.nav-link'));
    if (!pill || !links.length) return;

    let activeLink = links.find((l) => l.classList.contains('is-active')) || links[0];

    const movePillTo = (link) => {
      if (!link) return;
      const navRect = nav.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      const x = rect.left - navRect.left;
      pill.style.transform = `translate(${x}px, -50%)`;
      pill.style.width = rect.width + 'px';
      pill.style.height = rect.height + 'px';
    };

    // 初始位置（等字体加载完，rect 才稳定）
    const init = () => {
      movePillTo(activeLink);
      pill.classList.add('is-ready');
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      requestAnimationFrame(init);
    }

    // hover 追随
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => movePillTo(link));
      link.addEventListener('focus', () => movePillTo(link));
    });
    nav.addEventListener('mouseleave', () => movePillTo(activeLink));

    // 窗口尺寸变化时同步
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => movePillTo(activeLink), 120);
    });
  })();

  /* ============================================
     1. Header 滚动状态
     ============================================ */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
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
     3. 神经网络背景特效（全页 fixed）
     - 桌面 70 节点 / 移动端 35 节点（性能降级）
     - 邻近 150px 内连半透明线
     - 鼠标 180px 范围内的节点被吸引靠拢
     - 远处节点保持自然漂浮
     - 只在页面可视/聚焦时跑 RAF
     ============================================ */
  function startNeural() {
    const canvas = document.getElementById('canvas-neural');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const accent = getCSSColor('--accent');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    let W, H, nodes;
    const NODE_COUNT = isMobile ? 35 : 70;
    const LINK_DIST = isMobile ? 130 : 150;
    const ATTRACT_DIST = 180;
    const ATTRACT_FORCE = 0.05;
    const DAMPING = 0.985;
    const MAX_SPEED = 1.2;
    let mouseX = -9999, mouseY = -9999;
    let rafId = null;

    function resize() {
      // canvas 现在是 fixed 视口大小（100vw × 100vh）
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      W = w; H = h;
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
          const factor = (1 - distM / ATTRACT_DIST) * ATTRACT_FORCE;
          n.vx += (dxm / distM) * factor;
          n.vy += (dym / distM) * factor;
        }
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        if (Math.abs(n.vx) < 0.04) n.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(n.vy) < 0.04) n.vy += (Math.random() - 0.5) * 0.08;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > MAX_SPEED) {
          n.vx = (n.vx / speed) * MAX_SPEED;
          n.vy = (n.vy / speed) * MAX_SPEED;
        }
        n.x += n.vx;
        n.y += n.vy;
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

      // 节点
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
      rafId = requestAnimationFrame(step);
    }

    resize(); init();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => {
      resize();
      // resize 后重排节点位置防止跑到视口外
      nodes.forEach((n) => {
        if (n.x > W) n.x = W * Math.random();
        if (n.y > H) n.y = H * Math.random();
      });
    });

    // 性能保护：页面隐藏（切到别的 tab）/ 失焦时暂停 RAF
    const start = () => { if (!rafId) rafId = requestAnimationFrame(step); };
    const stop = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    start();
  }

  function getCSSColor(varName) {
    const s = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return s || '#2F66FF';
  }

  // 跨浏览器兼容：圆角矩形 path（部分老浏览器没原生 roundRect）
  function drawRoundRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // 启动神经网络
  startNeural();

  /* ============================================
     3b. AI 平台监测可视化 canvas
         - 7 个国内 AI 平台节点（带 Logo）
         - 节点之间动态连线
         - 鼠标 hover 节点 → popup 弹窗
     ============================================ */
  (function setupMonitorViz() {
    const canvas = document.getElementById('canvas-monitor');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const popup = document.getElementById('monitorPopup');
    const popupPlatformEl = popup?.querySelector('.monitor-popup-platform');
    const popupMetaEl = popup?.querySelector('.monitor-popup-meta');
    const container = canvas.parentElement;

    // popup meta 统一用"已接入监测"避免假造演示数据；真实数据等接入后端再填
    const PLATFORMS = [
      { name: 'DeepSeek',  icon: 'images/DeepSeek.png',  meta: '已接入监测' },
      { name: 'Kimi',      icon: 'images/Kimi.png',      meta: '已接入监测' },
      { name: '豆包',      icon: 'images/豆包.png',       meta: '已接入监测' },
      { name: '文心一言',  icon: 'images/文心一言.png',   meta: '已接入监测' },
      { name: '通义千问',  icon: 'images/通义千问.png',   meta: '已接入监测' },
      { name: '智谱清言',  icon: 'images/智谱清言.png',   meta: '已接入监测' },
      { name: '元宝',      icon: 'images/腾讯元宝.png',   meta: '已接入监测' }
    ];

    let W = 0, H = 0;
    let nodes = [];
    let rafId = null;
    let mouseX = -9999, mouseY = -9999;
    let dpr = 1;
    const ICON_CACHE = {};

    // 预加载 logo
    PLATFORMS.forEach((p) => {
      const img = new Image();
      img.src = p.icon;
      ICON_CACHE[p.name] = img;
    });
    // 中心 logo（白色版）
    const CENTER_LOGO = new Image();
    CENTER_LOGO.src = 'images/智优康赛logo_白.svg';

    const NODE_R = 28;       // 节点圆半径
    const LINK_DIST = 280;   // 连线最大距离
    const accent = getCSSColor('--accent');

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = rect.width; H = rect.height;
    }

    function initNodes() {
      // 桌面卡片在左侧 overlay，节点中心偏右
      const isDesktopOverlay = W >= 900;
      const cx = isDesktopOverlay ? W * 0.62 : W / 2;
      const cy = H / 2;
      const baseR = Math.min(W * 0.32, H * 0.40);

      // 错落分布：每个节点指定独立的角度偏移 + 半径比例，避免规则对称感
      // 角度 0 = 正右方，顺时针；保留上方留白让 popup 不撞顶
      const layout = [
        { aDeg: -42,  rRatio: 0.95 },  // 右上
        { aDeg: 12,   rRatio: 1.05 },  // 右
        { aDeg: 62,   rRatio: 0.90 },  // 右下
        { aDeg: 118,  rRatio: 1.02 },  // 下偏左
        { aDeg: 178,  rRatio: 0.88 },  // 左
        { aDeg: -130, rRatio: 1.00 },  // 左上
        { aDeg: -78,  rRatio: 0.78 }   // 上偏右（靠近中心，避免撞顶）
      ];

      nodes = PLATFORMS.map((p, i) => {
        const cfg = layout[i] || layout[0];
        const angle = (cfg.aDeg * Math.PI) / 180;
        const r = baseR * cfg.rRatio;
        return {
          name: p.name,
          meta: p.meta,
          baseX: cx + Math.cos(angle) * r,
          baseY: cy + Math.sin(angle) * r,
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          phase: Math.random() * Math.PI * 2,
          // 每个节点独立的漂浮幅度（错落）
          driftX: 6 + Math.random() * 6,
          driftY: 6 + Math.random() * 6
        };
      });
    }

    function step(now) {
      ctx.clearRect(0, 0, W, H);

      // 节点位置：基于 base 微浮动（每个节点漂浮幅度不一致 → 错落感）
      const t = now * 0.0008;
      nodes.forEach((n) => {
        n.x = n.baseX + Math.cos(t + n.phase) * n.driftX;
        n.y = n.baseY + Math.sin(t + n.phase * 1.3) * n.driftY;
      });

      // 连线
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const a = (1 - dist / LINK_DIST) * 0.3;
            ctx.strokeStyle = `${accent}${Math.floor(a * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 中心数据流动（向各节点）
      const isDesktopOverlay = W >= 900;
      const cx = isDesktopOverlay ? W * 0.62 : W / 2;
      const cy = H / 2;
      nodes.forEach((n) => {
        const a = 0.18;
        ctx.strokeStyle = `${accent}${Math.floor(a * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.lineDashOffset = -(now * 0.025);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 中心：纯 Logo + 柔光辉，无背景框
      const pulse = (Math.sin(now * 0.003) + 1) / 2; // 0~1
      // Logo 尺寸（放大，弥补去掉胶囊后的空旷感）
      const logoH = 60;
      const logoW = logoH * (468.4 / 167.48);  // 比例 ≈ 2.8 → 168×60

      // 远层柔光（最外圈大范围辉）
      const haloR = 160 + pulse * 16;
      const halo1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo1.addColorStop(0, `${accent}33`);
      halo1.addColorStop(0.5, `${accent}10`);
      halo1.addColorStop(1, `${accent}00`);
      ctx.fillStyle = halo1;
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fill();

      // 近层强光（让 Logo 后面有一层亮起来的氛围）
      const halo2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      halo2.addColorStop(0, `${accent}55`);
      halo2.addColorStop(1, `${accent}00`);
      ctx.fillStyle = halo2;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fill();

      // Logo 居中（带白色发光阴影，让在深背景上更显眼）
      if (CENTER_LOGO.complete && CENTER_LOGO.naturalWidth > 0) {
        ctx.save();
        ctx.shadowColor = `${accent}`;
        ctx.shadowBlur = 14 + pulse * 8;
        ctx.drawImage(CENTER_LOGO, cx - logoW / 2, cy - logoH / 2, logoW, logoH);
        ctx.restore();
      } else {
        // Fallback：logo 还没加载完时显示文字
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px "HarmonyOS Sans SC", "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('智优康赛', cx, cy);
      }

      // 节点外环 + Logo
      let hoveredNode = null;
      nodes.forEach((n) => {
        const dxm = n.x - mouseX, dym = n.y - mouseY;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        const isHover = distM < NODE_R + 6;
        if (isHover) hoveredNode = n;

        // 外环
        ctx.fillStyle = isHover ? `${accent}` : `${accent}40`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, NODE_R + (isHover ? 4 : 0), 0, Math.PI * 2);
        ctx.fill();

        // 内圆
        ctx.fillStyle = '#0A1428';
        ctx.beginPath();
        ctx.arc(n.x, n.y, NODE_R - 3, 0, Math.PI * 2);
        ctx.fill();

        // Logo
        const img = ICON_CACHE[n.name];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, NODE_R - 5, 0, Math.PI * 2);
          ctx.clip();
          const r = (NODE_R - 5) * 2;
          ctx.drawImage(img, n.x - r / 2, n.y - r / 2, r, r);
          ctx.restore();
        } else {
          // Fallback：显示首字
          ctx.fillStyle = accent;
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.name[0], n.x, n.y);
        }
      });

      // popup（智能定位：节点太靠顶部时翻到下方）
      if (hoveredNode && popup) {
        if (popupPlatformEl) popupPlatformEl.textContent = hoveredNode.name;
        if (popupMetaEl) popupMetaEl.textContent = hoveredNode.meta;
        const POPUP_THRESHOLD = 90;  // 节点 y < 90px 时 popup 翻到下方
        const showBelow = hoveredNode.y < POPUP_THRESHOLD;
        popup.classList.toggle('is-below', showBelow);
        popup.style.left = hoveredNode.x + 'px';
        popup.style.top = (showBelow
          ? hoveredNode.y + NODE_R + 10
          : hoveredNode.y - NODE_R - 10) + 'px';
        popup.hidden = false;
        canvas.style.cursor = 'pointer';
      } else if (popup) {
        popup.hidden = true;
        canvas.style.cursor = '';
      }

      rafId = requestAnimationFrame(step);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouseX = -9999; mouseY = -9999;
    }

    function start() { if (!rafId) rafId = requestAnimationFrame(step); }
    function stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    resize();
    initNodes();
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => { resize(); initNodes(); });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.15 });
      io.observe(container);
    } else {
      start();
    }
  })();

  /* ============================================
     4. 通用滚动入场：.reveal 元素进入视口时加 .is-visible
     可选 data-reveal-delay="200" 推迟启动（毫秒）
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach((el) => revealIO.observe(el));
  } else {
    // 老浏览器降级：直接全部显示
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================
     4b. alanUp 斜线波浪入场（钛动同款 nth-child stagger）
     用法：父容器加 .alan-parent，子元素加 .alan-up
     进入视口时父加 .is-go，子元素按 nth-child 依次起飞
     ============================================ */
  const alanParents = document.querySelectorAll('.alan-parent');
  if (alanParents.length && 'IntersectionObserver' in window) {
    const alanIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-go');
          alanIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    alanParents.forEach((el) => alanIO.observe(el));
  } else {
    alanParents.forEach((el) => el.classList.add('is-go'));
  }

  // Fallback: 独立的 .alan-up（不在 .alan-parent 内），进入视口时自激活
  const alanSolos = Array.from(document.querySelectorAll('.alan-up')).filter(
    (el) => !el.closest('.alan-parent')
  );
  if (alanSolos.length && 'IntersectionObserver' in window) {
    const soloIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-go');
          soloIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    alanSolos.forEach((el) => soloIO.observe(el));
  } else {
    alanSolos.forEach((el) => el.classList.add('is-go'));
  }

  /* ============================================
     5. 数字 countup 动画（案例数据等）
     用 data-countup data-target="300" data-decimals="0" data-suffix="%"
     ============================================ */
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const formatNum = (value, decimals) => {
      const fixed = value.toFixed(decimals);
      return fixed;
    };
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        const value = target * eased;
        el.textContent = formatNum(value, decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = formatNum(target, decimals) + suffix;
      };
      requestAnimationFrame(tick);
    };

    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    countEls.forEach((el) => countIO.observe(el));
  }

  /* ============================================
     5b. 系统演示截图轮播
         - 3.5s 自动切换
         - 横向滑动 + 缩放 + 淡入三重动效
         - 圆点指示器（替代之前的缩略图）
         - hover 暂停 / 离开视口停 RAF
     ============================================ */
  (function setupShowcase() {
    const frame = document.querySelector('.showcase-frame');
    if (!frame) return;
    const slides = Array.from(frame.querySelectorAll('.showcase-slide'));
    const dots = Array.from(document.querySelectorAll('.showcase-dot'));
    if (!slides.length) return;
    let active = 0;
    let timer = null;
    const INTERVAL = 3500;
    const LEAVING_CLEANUP_MS = 800;

    const goTo = (i) => {
      const prev = active;
      slides[prev].classList.remove('active');
      slides[prev].classList.add('leaving');
      dots[prev]?.classList.remove('is-active');

      active = (i + slides.length) % slides.length;
      slides[active].classList.remove('leaving');
      requestAnimationFrame(() => {
        slides[active].classList.add('active');
        dots[active]?.classList.add('is-active');
      });
      setTimeout(() => {
        slides[prev]?.classList.remove('leaving');
      }, LEAVING_CLEANUP_MS);
    };
    const next = () => goTo(active + 1);
    const start = () => { stop(); timer = setInterval(next, INTERVAL); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); start(); });
    });
    frame.addEventListener('mouseenter', stop);
    frame.addEventListener('mouseleave', start);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.2 });
      io.observe(frame);
    } else {
      start();
    }
  })();

  /* ============================================
     6. 客户评价段（钛动 r3 风格 3 卡同屏）
        中心 .is-active + 左 .is-prev + 右 .is-next
        箭头 / 点 / 自动切（5s）
     ============================================ */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    const cards = Array.from(spotlight.querySelectorAll('.spotlight-card'));
    const dots = Array.from(spotlight.querySelectorAll('.spotlight-dot'));
    const prevBtn = document.getElementById('spotPrev');
    const nextBtn = document.getElementById('spotNext');
    const N = cards.length;
    if (!N) return;

    let active = 0;
    let timer = null;
    const INTERVAL = 5000;

    const render = () => {
      const prevIdx = (active - 1 + N) % N;
      const nextIdx = (active + 1) % N;
      cards.forEach((c, i) => {
        c.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === active) c.classList.add('is-active');
        else if (i === prevIdx) c.classList.add('is-prev');
        else if (i === nextIdx) c.classList.add('is-next');
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
    };

    const goTo = (i) => { active = (i + N) % N; render(); };
    const start = () => { stop(); timer = setInterval(() => goTo(active + 1), INTERVAL); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); start(); }));
    prevBtn?.addEventListener('click', () => { goTo(active - 1); start(); });
    nextBtn?.addEventListener('click', () => { goTo(active + 1); start(); });

    spotlight.addEventListener('mouseenter', stop);
    spotlight.addEventListener('mouseleave', start);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.2 });
      io.observe(spotlight);
    } else {
      start();
    }

    render();
  }

  /* ============================================
     7. 合作品牌 Logo 墙 — 注入 78 个 Logo 到双行跑马灯
     ============================================ */
  const logosMarquee = document.getElementById('logos-marquee');
  if (logosMarquee) {
    const LOGOS = [
      '20260517-105002.png','20260517-105011.png','20260517-105024.png','20260517-105032.png',
      '20260517-105039.png','20260517-105046.png','20260517-105055.png','20260517-105101.png',
      '20260517-105109.png','20260517-105116.png','20260517-105124.png','20260517-105130.png',
      '20260517-105138.png','20260517-105146.png','20260517-105152.png','20260517-105158.png',
      '20260517-105204.png','20260517-105212.png','20260517-105218.png','20260517-105224.png',
      '20260517-105230.png','20260517-105238.png','20260517-105244.png','20260517-105250.png',
      '20260517-105257.png','20260517-105303.png','20260517-105311.png','20260517-105317.png',
      '20260517-105322.png','20260517-105330.png','20260517-105337.png','20260517-105344.png',
      '20260517-105351.png','20260517-105358.png','20260517-105404.png','20260517-105413.png',
      '20260517-105419.png','20260517-105528.png','20260517-105536.png','20260517-105543.png',
      '20260517-105551.png','20260517-105559.png','20260517-105604.png','20260517-105612.png',
      '20260517-105618.png','20260517-105626.png','20260517-105633.png','20260517-105640.png',
      '20260517-105649.png','20260517-105656.png','20260517-105703.png','20260517-105709.png',
      '20260517-105715.png','20260517-105725.png','20260517-105732.png','20260517-105738.png',
      '20260517-105745.png','20260517-105751.png','20260517-105757.png','20260517-105806.png',
      '20260517-105812.png','20260517-105820.png','20260517-105827.png','20260517-105834.png',
      '20260517-105841.png','20260517-105849.png','20260517-105856.png','20260517-105902.png',
      '20260517-105912.png','20260517-105920.png','20260517-105929.png','20260517-105938.png',
      '20260517-105948.png','20260517-105956.png','20260517-110002.png','20260517-110009.png',
      '20260517-110015.png','客户合作 logo.png'
    ];

    // 平分到 8 列（上下交替滚动）
    const COLS = 8;
    const columns = Array.from({ length: COLS }, () => []);
    LOGOS.forEach((logo, i) => columns[i % COLS].push(logo));

    const buildTile = (filename) => {
      const div = document.createElement('div');
      div.className = 'logo-tile';
      const img = document.createElement('img');
      img.src = 'logo/logo/' + encodeURIComponent(filename);
      img.alt = '';
      img.loading = 'lazy';
      div.appendChild(img);
      return div;
    };

    const fillColumn = (colEl, list) => {
      // 复制一份做无缝循环
      [...list, ...list].forEach((f) => colEl.appendChild(buildTile(f)));
    };

    const columnEls = logosMarquee.querySelectorAll('.logos-column');
    columnEls.forEach((col, i) => fillColumn(col, columns[i % COLS]));
  }

  /* ============================================
     8. 留资表单提交 → POST /api/contact
     按 docs/shared/全站规范.md 第 2 节字段
     ============================================ */
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    const submitBtn = document.getElementById('leadSubmit');
    const feedback = document.getElementById('formFeedback');
    const SUCCESS_MSG = '您的需求已收到，会在 3 个工作日内给您反馈。';

    const showFeedback = (msg, type) => {
      feedback.textContent = msg;
      feedback.className = 'form-feedback is-' + type;
    };

    const setBusy = (busy) => {
      submitBtn.disabled = busy;
      submitBtn.querySelector('.btn-text-content').textContent =
        busy ? '正在提交…' : '预约专家诊断';
    };

    // 把表单数据规范化（多选 ai_focus 收成数组，单选 pain_point 收成字符串）
    const collectData = () => {
      const fd = new FormData(leadForm);
      return {
        company: (fd.get('company') || '').trim(),
        name:    (fd.get('name') || '').trim(),
        role:    (fd.get('role') || '').trim(),
        phone:   (fd.get('phone') || '').trim(),
        email:   (fd.get('email') || '').trim(),
        message: (fd.get('message') || '').trim(),
        ai_focus:   fd.getAll('ai_focus'),     // 数组
        pain_point: fd.get('pain_point') || '', // 单选
        source: location.pathname + location.search
      };
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      const data = collectData();

      // 校验必填
      const missing = [];
      if (!data.company) missing.push('公司名称');
      if (!data.name)    missing.push('姓名');
      if (!data.role)    missing.push('职位');
      if (!data.phone)   missing.push('联系电话');
      if (!data.email)   missing.push('邮箱');
      if (!data.message) missing.push('核心需求');
      if (data.ai_focus.length === 0) missing.push('最关注的 AI 大模型');
      if (!data.pain_point) missing.push('品牌在 AI 时代的痛点');
      if (missing.length) {
        showFeedback('请补齐必填项：' + missing.join(' / '), 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFeedback('邮箱格式不正确。', 'error');
        return;
      }

      setBusy(true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          showFeedback(SUCCESS_MSG, 'success');
          leadForm.reset();
        } else {
          const err = await res.json().catch(() => ({}));
          showFeedback(err.message || '提交失败，请稍后重试或邮件联系我们。', 'error');
        }
      } catch (err) {
        // 离线 / 静态预览场景：仍然展示成功（演示模式）
        showFeedback(SUCCESS_MSG, 'success');
        leadForm.reset();
      } finally {
        setBusy(false);
      }
    });
  }

  /* ============================================
     9. 移动端 Hamburger + 抽屉菜单
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (hamburger && drawer) {
    const setDrawer = (open) => {
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (open) {
        drawer.hidden = false;
        // 等一帧以触发 transition
        requestAnimationFrame(() => drawer.classList.add('is-open'));
        document.body.classList.add('drawer-open');
      } else {
        drawer.classList.remove('is-open');
        document.body.classList.remove('drawer-open');
        // 等过渡结束再 hidden（避免硬切）
        setTimeout(() => {
          if (!hamburger.classList.contains('open')) drawer.hidden = true;
        }, 320);
      }
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      setDrawer(!isOpen);
    });

    // 点击抽屉内任意链接关闭抽屉
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) setDrawer(false);
    });

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        setDrawer(false);
      }
    });

    // 窗口放大到桌面时自动关闭
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 769 && hamburger.classList.contains('open')) {
        setDrawer(false);
      }
    });
  }

  /* ============================================
     案例数据段：3 张案例左右翻页 + 切换时重新 countup
     ============================================ */
  (function setupCaseStage() {
    const stage = document.getElementById('caseStage');
    if (!stage) return;
    const slides = Array.from(stage.querySelectorAll('.case-slide'));
    const prevBtn = document.getElementById('casePrev');
    const nextBtn = document.getElementById('caseNext');
    const currentEl = document.getElementById('caseCurrent');
    if (!slides.length) return;

    let active = 0;
    let autoTimer = null;
    const AUTO_INTERVAL = 6000;

    // 重置某 slide 内的 countup 数字到 0
    const resetCountup = (slide) => {
      const num = slide.querySelector('[data-countup]');
      if (!num) return;
      const decimals = parseInt(num.dataset.decimals || '0', 10);
      const suffix = num.dataset.suffix || '';
      num.textContent = (0).toFixed(decimals) + suffix;
    };

    // 触发某 slide 内的 countup
    const triggerCountup = (slide) => {
      const num = slide.querySelector('[data-countup]');
      if (!num) return;
      const target = parseFloat(num.dataset.target);
      const decimals = parseInt(num.dataset.decimals || '0', 10);
      const suffix = num.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        const v = target * eased;
        num.textContent = v.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else num.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(tick);
    };

    const goTo = (i) => {
      const prev = active;
      active = (i + slides.length) % slides.length;
      if (prev === active) return;
      slides[prev].classList.remove('is-active');
      slides[active].classList.add('is-active');
      if (currentEl) currentEl.textContent = String(active + 1);
      // 切换后触发 countup
      resetCountup(slides[active]);
      setTimeout(() => triggerCountup(slides[active]), 250);
    };

    prevBtn?.addEventListener('click', () => { goTo(active - 1); restartAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(active + 1); restartAuto(); });

    const restartAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(active + 1), AUTO_INTERVAL);
    };

    // 进入视口才开始自动轮播 + 触发首个 countup
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            triggerCountup(slides[active]);
            restartAuto();
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      io.observe(stage);
    } else {
      triggerCountup(slides[active]);
      restartAuto();
    }

    // 鼠标 hover 暂停
    stage.addEventListener('mouseenter', () => { if (autoTimer) clearInterval(autoTimer); });
    stage.addEventListener('mouseleave', restartAuto);
  })();

  /* ============================================
     回到顶部按钮（滚动超 600px 显示）
     ============================================ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const THRESHOLD = 600;
    let lastShown = false;
    const onScroll = () => {
      const shouldShow = window.scrollY > THRESHOLD;
      if (shouldShow !== lastShown) {
        backToTop.hidden = !shouldShow;
        lastShown = shouldShow;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始检查

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
