/* 系统演示页交互
   - 5 张截图横向 scroll-snap：dots 与滚动联动
*/

(function () {
  'use strict';

  const track = document.getElementById('demoScreensTrack');
  const dots = Array.from(document.querySelectorAll('.demo-screen-dot'));
  if (!track || !dots.length) return;

  const screens = Array.from(track.querySelectorAll('.demo-screen'));

  // 滚动到指定 idx
  const goTo = (idx) => {
    const target = screens[idx];
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  // 点击 dot 跳转
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // 滚动时更新 active dot（用 IntersectionObserver 判断中心可见）
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = screens.indexOf(entry.target);
          if (idx >= 0) {
            dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
          }
        }
      });
    }, {
      root: track,
      threshold: 0.6,
    });
    screens.forEach((s) => io.observe(s));
  }
})();
