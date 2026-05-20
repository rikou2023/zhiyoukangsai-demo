---
version: alpha
name: AIconcepts-design-system
description: |
  智优康赛（AIconcepts）官网设计系统。深海军蓝 canvas（#0A1428）作为主背景，
  搭配电光蓝（#2F66FF）作为**唯一**品牌强调色——克制使用在 CTA、关键数字、状态指示器上。
  Type voice 中文采用 HarmonyOS Sans / MiSans 的现代企业感，英文使用 Inter Tight，
  技术 label 与 metric 数字使用 JetBrains Mono。
  surface 5 档 / hairline 3 档 / ink 4 档建立精密层级。
  品牌质感来自三个真实元素：神经网络节点背景动效 + 国内 AI 平台 logo 跑马灯 + 真实产品 dashboard 截图。
  不做装饰性渐变、玻璃磨砂、紫粉光晕、卡通插画。
  系统读起来像"成熟的企业级数据平台"——dense, technical, trustworthy.

# ============================================================
# 1. 色彩 · COLORS
# ============================================================
colors:
  # 品牌色（客户锁定，3 态）
  primary: "#2F66FF"           # 电光蓝 · 唯一品牌色
  primary-hover: "#4781FF"     # hover 略亮
  primary-pressed: "#1E54E8"   # active 略暗
  primary-soft: "rgba(47, 102, 255, 0.12)"   # 浅光背景
  primary-glow: "rgba(47, 102, 255, 0.32)"   # 发光阴影
  on-primary: "#FFFFFF"

  # 背景层（5 档 surface 阶梯）
  canvas: "#0A1428"            # 主背景 · 客户锁定深海军
  canvas-soft: "#0E1A30"       # section 隔离层
  surface-1: "#142036"         # 卡片底
  surface-2: "#1A2A47"         # 抬起卡片
  surface-3: "#1F314D"         # 高亮 / hover surface
  surface-4: "#243859"         # 浮起元素 / drawer

  # 文字（4 档 ink 阶梯）
  ink: "#F8FAFC"               # 主文字 · 大标题
  ink-muted: "#C8D0DC"         # 次文字 · 正文
  ink-subtle: "#8B96AD"        # 辅助 · 说明
  ink-tertiary: "#5E6878"      # 最弱 · 时间戳 / 角标

  # 边框（3 档 hairline 阶梯）
  hairline: "rgba(255, 255, 255, 0.06)"      # 普通分隔
  hairline-strong: "rgba(255, 255, 255, 0.12)"  # 卡片边
  hairline-bright: "rgba(255, 255, 255, 0.18)"  # hover / focused

  # 选区与高亮
  selection-bg: "#2F66FF"
  selection-fg: "#FFFFFF"

  # 状态色（仅用于状态指示器，不用于装饰）
  signal-success: "#00E676"    # 监测中 / online
  signal-warning: "#FFB020"    # 风险提示
  signal-error: "#FF4D4D"      # 痛点 / 异常
  signal-info: "#2F66FF"       # info（等于品牌色）

  # 反白 inverse（少量场景：白底浮窗、light 模式表单）
  inverse-canvas: "#FFFFFF"
  inverse-surface: "#F5F7FA"
  inverse-ink: "#0A1428"
  inverse-hairline: "#E1E6EE"

# ============================================================
# 2. 字体 · TYPOGRAPHY
# ============================================================
typography:
  # 字体族
  fontFamily-display: "'Inter Tight', 'HarmonyOS Sans SC', 'MiSans', 'PingFang SC', 'Source Han Sans SC', system-ui, sans-serif"
  fontFamily-body:    "'Inter', 'HarmonyOS Sans SC', 'MiSans', 'PingFang SC', 'Source Han Sans SC', system-ui, sans-serif"
  fontFamily-mono:    "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace"

  # 完整 type scale · 12 档
  display-xl:
    fontFamily: display
    fontSize: clamp(56px, 9vw, 128px)    # hero 主标
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.045em

  display-lg:
    fontFamily: display
    fontSize: clamp(40px, 6vw, 72px)
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.035em

  display-md:
    fontFamily: display
    fontSize: clamp(32px, 4.5vw, 56px)
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.03em

  display-sm:
    fontFamily: display
    fontSize: clamp(24px, 3vw, 36px)
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.025em

  headline:
    fontFamily: display
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em

  card-title:
    fontFamily: display
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em

  subhead:
    fontFamily: body
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em

  body-lg:
    fontFamily: body
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.005em

  body:
    fontFamily: body
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0

  body-sm:
    fontFamily: body
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

  caption:
    fontFamily: body
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0

  button:
    fontFamily: body
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.005em

  eyebrow:
    fontFamily: mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.12em
    textTransform: uppercase

  mono-num:
    fontFamily: mono
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    fontFeatureSettings: '"tnum", "zero"'

  # 大数字（专用于 metric / KPI 数字 countup）
  metric-display:
    fontFamily: display
    fontSize: clamp(56px, 8vw, 112px)
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: -0.045em
    fontFeatureSettings: '"tnum"'

# ============================================================
# 3. 间距 · SPACING（4 基数严格阶梯）
# ============================================================
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 64px
  '9': 96px
  '10': 128px
  '11': 192px
  section-y: clamp(72px, 11vw, 160px)
  section-y-tight: clamp(48px, 7vw, 96px)
  section-y-large: clamp(96px, 14vw, 200px)

# ============================================================
# 4. 圆角 · ROUNDED
# ============================================================
rounded:
  xs: 3px       # 小元素（badge / kbd）
  sm: 6px       # input / chip
  md: 8px       # 按钮 / 卡片默认
  lg: 12px      # 大卡片 / 容器
  xl: 16px      # 主要面板
  xxl: 24px     # 极少用
  pill: 9999px  # 胶囊 / tag

# ============================================================
# 5. 阴影 · SHADOWS（克制，极淡）
# ============================================================
shadows:
  card: "0 1px 0 0 var(--hairline-strong) inset, 0 0 0 0 transparent"
  lift: "0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 1px 0 0 var(--hairline-strong) inset"
  raised: "0 12px 40px -8px rgba(0, 0, 0, 0.55), 0 1px 0 0 var(--hairline-strong) inset"
  glow-primary: "0 0 0 1px var(--primary), 0 0 24px var(--primary-glow)"
  glow-primary-sm: "0 0 12px var(--primary-glow)"

# ============================================================
# 6. 动效 · MOTION（全站只用一套 easing + 3 档 duration）
# ============================================================
motion:
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)"
  ease-expo: "cubic-bezier(0.7, 0, 0.3, 1)"
  dur-fast: 180ms
  dur: 320ms
  dur-slow: 680ms

  # 全站允许的动效（其他一律禁止）
  allowed-animations:
    - neural-network-canvas       # 首页 Hero 神经网络 70 节点 + 180px 鼠标吸附
    - ai-platform-marquee         # AI 平台 logo 跑马灯（线性匀速）
    - testimonial-spotlight       # 客户评价聚光灯轮播
    - client-logo-double-row      # 78 客户 logo 双行反向滚动
    - counter-countup             # 数字阵列入场 countup
    - fade-up-reveal              # 通用入场（opacity + translateY 20px）
    - alanUp-stagger              # 入场 stagger（按 nth-child 错峰，保留钛动同款节奏）

  # 明确禁止的（防 AI slop）
  forbidden-animations:
    - hover-lift-cards            # 内容卡 hover 起浮（仅 CTA 可 hover）
    - preloader-progress          # 静态站不需要
    - rotating-decorative-shapes  # 装饰 SVG 旋转 / 粒子轨道
    - parallax-scroll             # 视差滚动
    - glow-pulse-loops            # 元素发光脉冲循环
    - 3d-perspective-rotate       # 3D 透视旋转

# ============================================================
# 7. 客户锁定边界 · BRAND CONSTRAINTS（必读）
# ============================================================
locked-by-customer:
  # 客户已拍板的不可变项
  colors:
    - "primary 必须是 #2F66FF 电光蓝（唯一品牌色）"
    - "canvas 必须是 #0A1428 深海军（不可改为纯黑 / 米色 / 暗紫）"
    - "禁止：紫色 / 粉色 / 彩虹渐变 / chartreuse / 玻璃磨砂 / 紫粉光晕 / 漂浮光球"
  content-elements:
    - "首页 Hero 神经网络节点 70 个 + 鼠标 180px 半径吸附"
    - "首页 AI 平台 logo 跑马灯（横滑，国内 7 个）"
    - "客户评价聚光灯轮播 + 短评跑马灯"
    - "78 客户合作 logo 双行反向滚动 + 6 大行业客户名单"
    - "产品优势 3 × 6 = 18 个胶囊矩阵（一模一样照搬客户参考图）"
    - "行业根基 4 / 6 / 100+ / 30+ 数字 countup 阵列"
    - "8 个资质徽章 chip"
    - "case 数据 countup 入场动画"
    - "专属服务流程图 PNG 一模一样照搬（不可重画）"
  copywriting:
    - "所有页面文案 100% 来自 docs/pages/*/README.md 的客户原文 docx"
    - "不允许编造数据、统计、客户原话引用"
    - "Hero 主标题：让您的品牌，占领 AI 的第一推荐位"
    - "Hero 副标钩子：客户在问 Kimi、文心一言、通义千问，但 AI 的回答里，有你的品牌吗？"

# ============================================================
# 8. 组件规范 · COMPONENTS
# ============================================================
components:

  # ---------- 按钮 ----------
  button-primary:
    backgroundColor: primary
    textColor: on-primary
    typography: button
    rounded: md
    padding: 12px 20px
    states:
      hover: "{primary-hover} + shadow.glow-primary-sm"
      pressed: primary-pressed
      disabled: surface-3
      focus: "ring 3px {primary-soft}"

  button-secondary:
    backgroundColor: surface-2
    textColor: ink
    typography: button
    rounded: md
    padding: 12px 20px
    border: "1px solid {hairline-strong}"
    states:
      hover: "border-color {hairline-bright}, bg {surface-3}"

  button-ghost:
    backgroundColor: transparent
    textColor: ink
    typography: button
    rounded: md
    padding: 12px 20px
    border: "1px solid {hairline-strong}"
    states:
      hover: "border-color {primary}, color {primary}"

  link-cta:
    backgroundColor: transparent
    textColor: ink
    typography: button
    paddingBottom: 4px
    border: "bottom 1px solid {hairline-strong}"
    states:
      hover: "color {primary}, border-color {primary}"

  # ---------- 卡片（统一 hover top-line 出现） ----------
  card-default:
    backgroundColor: surface-1
    textColor: ink
    typography: body
    rounded: lg
    padding: 24px
    border: "1px solid {hairline-strong}"
    hover-top-line: "primary, 2px, scaleX(0→1), {motion.dur-slow} {motion.ease-expo}"
    states:
      hover: "border-color {hairline-bright}, bg {surface-2}"

  card-feature:        # 4 大服务 / 7 大能力卡
    extends: card-default
    padding: 28px
    layout:
      head: "[番号 mono] + [icon 36px {primary}]"
      title: card-title
      desc: body-sm

  card-case:           # 案例数据大卡
    extends: card-default
    padding: 40px
    layout:
      metric: "metric-display {primary}"  # countup 入场
      body: "case-rows table"

  card-pricing:        # 仅子页可能用
    extends: card-default
    padding: 32px
    rounded: lg

  card-testimonial:    # 客户评价聚光灯卡
    backgroundColor: surface-1
    typography: body-lg
    rounded: lg
    padding: 32px
    quote-mark: "primary, 48px"
    layout:
      quote: subhead
      author: eyebrow

  # ---------- 表单 ----------
  text-input:
    backgroundColor: surface-2
    textColor: ink
    typography: body
    rounded: md
    padding: 14px 16px
    border: "1px solid {hairline-strong}"
    placeholder-color: ink-tertiary
    states:
      focus: "border-color {primary}, ring 3px {primary-soft}, bg {surface-1}"

  text-area:
    extends: text-input
    min-height: 96px
    resize: vertical

  field-label:
    typography: eyebrow
    color: ink-subtle
    spacing-below: 2

  checkbox-multi: ".form-row 6 个 AI 平台多选"
  radio-single:   ".form痛点 A/B/C/D 单选"

  form-card:
    extends: card-default
    padding: clamp(28px, 4vw, 48px)
    top-stripe: "linear-gradient(90deg, transparent, {primary}, transparent), 2px"
    status-indicator: "{signal-success} dot + 'ONLINE' mono caption"

  # ---------- 导航 ----------
  nav-top:
    backgroundColor: "rgba(10, 20, 40, 0.72)"
    backdropFilter: "blur(16px) saturate(150%)"
    height: 64px
    scrolled-state: "border-bottom 1px {hairline-strong}, bg opacity 0.88"
    pill: "primary 胶囊 + 弹性 cubic-bezier 追随"

  nav-link:
    typography: body-sm
    color: ink-subtle
    padding: "6px 0"
    states:
      hover: ink
      active: "ink + dot {primary} below"

  nav-cta-contact:
    extends: button-secondary
    backgroundColor: surface-2
    border: "1px solid {hairline-strong}"
  nav-cta-diagnose:
    backgroundColor: inverse-canvas
    textColor: primary
    typography: button
    rounded: md
    shadow: "0 0 16px rgba(255,255,255,0.15)"

  # ---------- 章节头（V2 验证过的高级感） ----------
  section-head:
    layout: "[num mono] [title display-lg] [meta mono]"
    border-bottom: "1px solid {hairline-strong}"
    padding-bottom: 24
    margin-bottom: 64
    num:
      typography: eyebrow
      color: ink-subtle
      format: "[01] / CORE SERVICES"   # 而非中文 "§01 / 第一节"
    title:
      typography: display-lg
      color: ink
      em-color: primary
    meta:
      typography: eyebrow
      color: ink-subtle
      align: right

  # ---------- 数据徽章 ----------
  badge:
    backgroundColor: surface-2
    textColor: ink-muted
    typography: eyebrow
    rounded: pill
    padding: "6px 12px"
    border: "1px solid {hairline-strong}"
    dot: "{primary}, 6px, glow + pulse animation"

  status-badge:
    extends: badge
    border: "1px solid {signal-success}"
    color: signal-success

  pain-badge:
    extends: badge
    border: "1px solid {signal-error}"
    color: signal-error

  kbd:
    backgroundColor: surface-2
    textColor: ink-muted
    typography: mono-num
    rounded: xs
    padding: "2px 8px"
    border: "1px solid {hairline-strong}"

  # ---------- 业务专属组件（客户锁定的核心元素） ----------

  neural-network-canvas:    # 首页 Hero 背景
    technology: "canvas + JS"
    nodes: 70
    connections-distance: 150px
    mouse-attract-radius: 180px
    node-color: "rgba(47, 102, 255, 0.6)"
    line-color: "rgba(47, 102, 255, 0.2)"
    z-index: 0
    placement: "hero only"

  ai-platform-marquee:     # 国内 AI 平台 logo 横滑
    direction: ltr
    duration: 45s
    pause-on-hover: false
    item:
      icon-wrap: "{paper} bg, rounded.md, 32×32, padding 4px"
      name: card-title
      sub: caption mono ink-tertiary
      pill-style: "rounded.pill, {surface-3} bg, padding 10px 22px, border {hairline-strong}"
    edge-fade: "linear-gradient masks 160px each side"

  testimonial-spotlight:   # 客户评价聚光灯
    layout: "8 长评循环 + 5 短评 marquee"
    long-card: card-testimonial
    spotlight-effect: "active card scale 1.04, opacity 1; others scale 0.96, opacity 0.6"
    interval: 4500ms
    pause-on-hover: true

  client-logo-double-row:  # 78 客户 logo 双行反向滚动
    rows: 2
    row-1-direction: ltr
    row-2-direction: rtl
    duration: 60s
    cell:
      backgroundColor: paper  # 白色容器装彩色 logo
      rounded: md
      aspect-ratio: "16 / 11"
      padding: 14px
      filter-default: "grayscale(0.35) opacity(0.9)"
      filter-hover: "grayscale(0) opacity(1)"

  capsule-matrix:          # 产品优势 3 × 6 胶囊
    columns: 3
    rows: 6
    cell-style:
      backgroundColor: surface-1
      rounded: pill
      padding: "10px 16px"
      border: "1px solid {hairline-strong}"
      typography: body-sm
      icon: "{primary} dot 4px"
    layout: "3 列竖排 × 6 行 = 18 项"

  counter-metric:          # 数字阵列 / countup
    num:
      typography: metric-display
      color: primary
      animation: "countup on visible, duration 1.6s"
      glow: "text-shadow 0 0 32px {primary-glow}"
    label:
      typography: eyebrow
      color: ink-subtle
    unit:
      typography: mono-num
      size: 0.4em of num
      color: ink-tertiary

  process-image-band:      # 专属服务流程图大图
    backgroundColor: inverse-canvas
    rounded: lg
    padding: 24px
    border: "1px solid {hairline-strong}"
    img: "width 100%, height auto, no-modify (客户锁定)"
    caption: "{eyebrow}, top-border {hairline-strong}"

  # ---------- Footer ----------
  footer:
    backgroundColor: canvas
    border-top: "1px solid {hairline-strong}"
    layout: "4 列 grid: 品牌 | 专属服务 | 解决方案 | 公司"
    padding: "96px {gutter} 48px"
    bottom-row: "mono caption ink-tertiary, top-border {hairline}"

# ============================================================
# 9. 布局原则 · LAYOUT
# ============================================================
layout:
  container: 1280px
  container-narrow: 920px
  container-wide: 1440px
  gutter: "clamp(20px, 4vw, 48px)"
  grid: "12-col"
  section-rhythm: "spacing.section-y between major sections"

  hierarchy-rules:
    - "每个 section 只一个主视觉焦点（大标题 / 大数字 / 系统截图 / 流程图）"
    - "信息密度适中，文字和数据要有呼吸感"
    - "正文宽度收窄到 56-65ch，标题可宽至 16ch"
    - "一屏一焦点叙事（参考 tryprofound.com 排版）"

  responsive:
    breakpoints:
      mobile: 0-640px
      tablet: 640-1024px
      desktop: 1024-1440px
      wide: 1440px+
    rules:
      - "mobile: nav drawer 抽屉式 + 数字阵列竖排 + grid 收 1 列"
      - "tablet: grid 2-3 列"
      - "desktop+: 完整布局"
      - "禁止：桌面布局等比压缩做 mobile（必须重新设计信息层级）"

# ============================================================
# 10. 滚动叙事节奏 · NARRATIVE
# ============================================================
narrative:
  homepage-flow:
    - hero                  # 主标题 + Hero CTA + 神经网络背景
    - ai-platform-marquee   # AI 平台 logo 横滑
    - pain-hooks            # 痛点浮现（红 badge + 3 大问句）
    - core-services         # 4 大核心服务（feature-card grid）
    - system-demo           # 系统演示轮播（5 张截图，3s 自动）
    - core-capabilities     # 7 大核心能力（feature-card grid）
    - product-matrix        # 产品优势 3×6 = 18 项（capsule-matrix）
    - solutions-5           # 5 大解决方案（横向 list rows）
    - cases-3               # 3 大案例（card-case + countup）
    - partners              # Google + SEMrush（partner-card 大图）
    - credentials           # 资质 4/6/100+/30+（counter-metric × 5）
    - testimonial-spotlight # 客户评价聚光灯
    - client-logo-wall      # 78 客户 logo 双行
    - cta-form              # CTA 表单
    - footer

  principle: "从痛点 → 系统能力 → 团队方案 → 数据证明 → 权威背书 → 最终 CTA 逐步推进，不要像资料目录"
---

## Overview · 设计哲学

### 一句话定调

> **不堆视觉，用真实数据 / 真实截图 / 真实背书说话。**
> 看上去像成熟的企业级数据平台，而不是营销 landing。

### 三条铁律

**1. 客户已锁定的不动**
配色 M（电光蓝 + 深海军）、神经网络背景、AI 跑马灯、客户评价聚光灯、78 logo 双行、3×6 胶囊矩阵、数字 countup、HarmonyOS Sans 字体——**这些都是客户拍板的，不可改**。

**2. 电光蓝克制使用**
全站 95% 是深海军 + 灰阶。电光蓝只出现在：
- CTA 按钮
- 关键 metric 数字（300% / 1.1亿+ / 37.22%）
- 状态指示器（实时监测的小绿点同理）
- 当前导航项
- 章节标题 `<em>` 强调字
- Hover 时的 hairline 亮起

**3. 真实素材作主角，禁止抽象装饰**
- ✅ 真实产品 dashboard 截图
- ✅ 真实客户 logo（白色 cell 装彩色 logo）
- ✅ 真实证书图
- ✅ 真实出版书籍封面
- ✅ Google + SEMrush 官方授权截图
- ❌ GEO 球体 / 3D 机器人 / 抽象数据流动 / 装饰光效

---

## 反 AI slop 自检清单

实现页面时，挨个对照：

| 自检项 | 必须 |
|---|---|
| 没用紫色 / 粉色 / 彩虹渐变 | ✅ |
| 没用玻璃磨砂 / backdrop-filter 过度 | ✅ |
| 没用卡通插画 / 3D 机器人 / 抽象漂浮元素 | ✅ |
| 没用 alanUp 全站 stagger | ✅ |
| 没用每张卡 hover 起浮 / 旋转 / scale | ✅ |
| 没用 preloader 进度条 | ✅ |
| 字体不是 Inter 一通到底 | ✅ |
| 章节编号是 mono `[01] / SECTION` 不是 `第一节` | ✅ |
| 卡片 hover 是顶部 2px 出现，不是整体抖动 | ✅ |
| 数据是客户原话，不是编的统计 | ✅ |
| 客户 logo 在白色 cell 里展示，不是直接放暗底上 | ✅ |
| 移动端是重新设计，不是桌面布局压缩 | ✅ |

---

## 实现优先级

```
P0  tokens.css 全量重写（按本文 colors / typography / spacing / rounded / shadows / motion）
P0  components.css 核心组件（button / card / section-head / badge / form / nav）
P1  index.css 首页应用新规范
P2  about / services / solutions / cases / demo / ecosystem 6 子页同步
P3  清理 contact.html / technology.html / 乱码遗留页
```

---

## 引用来源

- `~/.claude/references/awesome-design-md/design-md/linear.app/DESIGN.md` — 结构原型
- `~/.claude/references/awesome-design-md/design-md/vercel/DESIGN.md` — 字距 / 灰阶参考
- `~/.claude/references/awesome-design-md/design-md/claude/DESIGN.md` — 单色强调哲学
- `~/.claude/references/awesome-design-md/design-md/supabase/DESIGN.md` — 极简单色 CTA 哲学
- `docs/shared/全站规范.md` — 客户锁定边界
- `docs/ui-design-image2.md` — 客户视觉指引
- `docs/pages/*/README.md` — 各页客户原文
