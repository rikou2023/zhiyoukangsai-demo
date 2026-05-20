智优康赛 AIconcepts · 演示包部署说明
═══════════════════════════════════════

【方案 1】最简单 — 任何静态文件托管即可
─────────────────────────────────────
直接把本目录全部文件上传到服务器，主页是 index.html。
适用平台：Nginx / Apache / IIS / Vercel / Netlify / Cloudflare Pages
没有任何后端依赖、无构建步骤、纯静态 HTML/CSS/JS。

【方案 2】Nginx vhost 示例配置
─────────────────────────────────────
server {
    listen 80;
    server_name demo.example.com;
    root /var/www/zhiyoukangsai-demo;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|svg|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}

【方案 3】本地预览（开发者自检）
─────────────────────────────────────
进入本目录，执行：
    python -m http.server 8000
或者
    npx serve .

打开浏览器访问 http://localhost:8000

【目录结构】
─────────────────────────────────────
index.html              首页（带 Preloader 加载页）
solutions.html          GEO 解决方案
cases.html              客户案例
ecosystem.html          生态资源
demo.html               系统演示
about.html              关于我们
services.html           专属服务
assets/css/             所有样式
assets/js/              所有脚本
assets/about/           关于页素材（证书 / 书籍 / Google / SEMrush）
assets/system/          系统截图 + 后台截图
images/                 站点 logo + AI 平台 logo + 合作伙伴大图
logo/logo/              78 个合作品牌 logo

【浏览器兼容】
─────────────────────────────────────
推荐：Chrome / Edge / Safari / Firefox 最新两个大版本
最低：Chrome 90+ / Safari 14+

【留资表单注意】
─────────────────────────────────────
表单当前提交到 /api/contact 接口，演示环境下会失败但不影响展示其他效果。
正式上线前需后端配合接口实现。

【打包时间】
─────────────────────────────────────
2026-05-20 · feat/design-md-refactor 分支 V2 设计系统版本
