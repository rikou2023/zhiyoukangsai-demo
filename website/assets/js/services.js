/* 专属服务页交互
   - 4 阶段时间线滚动联动：滚动到阶段卡时点亮时间线点 + 填充进度条
*/

(function () {
  'use strict';

  const stages = document.querySelectorAll('.stage-card');
  const dots = document.querySelectorAll('.timeline-dot');
  const fill = document.getElementById('timelineFill');
  if (!stages.length || !dots.length || !fill) return;

  let currentReached = 0;

  const updateTimeline = (idx) => {
    if (idx < currentReached) return; // 只前进不后退（用户继续向下滚）
    currentReached = idx;
    dots.forEach((d, i) => d.classList.toggle('is-reached', i <= idx));
    // 进度条高度：到达第 idx 个 dot 的位置
    const pct = ((idx) / Math.max(1, dots.length - 1)) * 100;
    fill.style.height = `calc(${pct}% - 48px + ${pct === 0 ? 0 : 48}px)`;
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stageIdx = Array.prototype.indexOf.call(stages, entry.target);
          updateTimeline(stageIdx);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -30% 0px',
    });
    stages.forEach((s) => io.observe(s));
  } else {
    // 老浏览器降级：直接全亮
    dots.forEach((d) => d.classList.add('is-reached'));
    fill.style.height = 'calc(100% - 48px)';
  }
})();
