/* 智优康赛首页交互
   依赖：无第三方库（纯原生 JS）
*/

(function () {
  'use strict';

  // 客户已拍板用 M 主题
  document.documentElement.setAttribute('data-theme', 'M');

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
     3. 神经网络背景特效
     - 70 个节点 + 邻近 150px 内连半透明线
     - 鼠标 180px 范围内的节点被吸引靠拢（不是全部）
     - 远处节点保持自然漂浮
     ============================================ */
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
    let rafId = null;

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
    window.addEventListener('resize', () => { resize(); init(); });

    // 只在 Hero 可视范围内跑动画（性能保护）
    if ('IntersectionObserver' in window) {
      const hero = canvas.closest('.hero');
      if (hero) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !rafId) step();
            else if (!e.isIntersecting && rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          });
        }, { threshold: 0 });
        io.observe(hero);
        return;
      }
    }
    step();
  }

  function getCSSColor(varName) {
    const s = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return s || '#2F66FF';
  }

  // 启动神经网络
  startNeural();

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
     6. 客户评价聚光灯轮播（5s 切一条，悬停暂停）
     ============================================ */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    const slides = Array.from(spotlight.querySelectorAll('.spotlight-slide'));
    const dots = Array.from(spotlight.querySelectorAll('.spotlight-dot'));
    let active = 0;
    let timer = null;
    const INTERVAL = 5000;

    const goTo = (i) => {
      slides[active].classList.remove('is-active');
      dots[active]?.classList.remove('is-active');
      active = (i + slides.length) % slides.length;
      slides[active].classList.add('is-active');
      dots[active]?.classList.add('is-active');
    };

    const next = () => goTo(active + 1);
    const start = () => { stop(); timer = setInterval(next, INTERVAL); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); start(); });
    });
    spotlight.addEventListener('mouseenter', stop);
    spotlight.addEventListener('mouseleave', start);

    // 只在可见时跑
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.2 });
      io.observe(spotlight);
    } else {
      start();
    }
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
      '20260517-110015.png'
    ];

    // 平分到两行
    const half = Math.ceil(LOGOS.length / 2);
    const row1 = LOGOS.slice(0, half);
    const row2 = LOGOS.slice(half);

    const buildTile = (filename) => {
      const div = document.createElement('div');
      div.className = 'logo-tile';
      const img = document.createElement('img');
      img.src = 'logo/logo/' + filename;
      img.alt = '';
      img.loading = 'lazy';
      div.appendChild(img);
      return div;
    };

    const fillTrack = (track, list) => {
      // 复制一份做无缝循环
      [...list, ...list].forEach((f) => track.appendChild(buildTile(f)));
    };

    fillTrack(logosMarquee.querySelector('.logos-track-1'), row1);
    fillTrack(logosMarquee.querySelector('.logos-track-2'), row2);
  }

  /* ============================================
     8. 留资表单提交 → POST /api/contact
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
        busy ? '正在提交…' : '提交诊断需求';
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      // 基本前端校验
      const data = Object.fromEntries(new FormData(leadForm).entries());
      if (!data.name || !data.company || !data.email || !data.interest) {
        showFeedback('请补齐必填项（姓名 / 公司名称 / 邮箱 / 关注方向）。', 'error');
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
          body: JSON.stringify({
            ...data,
            source: location.pathname + location.search
          })
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
     9. 移动端 Hamburger（占位）
     ============================================ */
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
    });
  }
})();
