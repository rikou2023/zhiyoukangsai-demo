# -*- coding: utf-8 -*-
"""构建单文件预览 HTML 给客户看背景特效。

源：website/index.html
处理：
  - 内联 tokens.css + index.css 为 <style>
  - 内联 index.js 为 <script>
  - 内联 Logo SVG + 7 个 AI 平台 PNG 为 data URL
  - 删除「系统演示」整段（5 张 3-4MB 大图不适合单文件发送）
输出：effect-preview/index.html （单文件，自包含）
"""
import base64
import re
from io import BytesIO
from pathlib import Path

ROOT = Path(r"C:\IT-project\dev\zhiyoukangsai\website")
SRC_HTML = ROOT / "index.html"
TOKENS_CSS = ROOT / "assets" / "css" / "tokens.css"
INDEX_CSS = ROOT / "assets" / "css" / "index.css"
INDEX_JS = ROOT / "assets" / "js" / "index.js"
SVG_PATH = ROOT / "images" / "智优康赛logo.svg"
IMG_DIR = ROOT / "images"

OUT_DIR = Path(r"C:\IT-project\dev\zhiyoukangsai\effect-preview")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_HTML = OUT_DIR / "index.html"


def b64(data: bytes, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(data).decode('ascii')}"


def resize_png_to_88(png_bytes: bytes) -> bytes:
    from PIL import Image
    img = Image.open(BytesIO(png_bytes)).convert("RGBA")
    img = img.resize((88, 88), Image.LANCZOS)
    out = BytesIO()
    img.save(out, format="PNG", optimize=True)
    return out.getvalue()


def main() -> None:
    html = SRC_HTML.read_text(encoding="utf-8")

    # 1. 删除系统演示整段（避免单文件 20MB+）
    html = re.sub(
        r'  <!-- ========== 系统演示 ==========.*?</section>\s*\n',
        '',
        html,
        flags=re.DOTALL,
    )

    # 2. 内联 CSS：替换 <link rel="stylesheet" href="...">
    tokens_css = TOKENS_CSS.read_text(encoding="utf-8")
    index_css = INDEX_CSS.read_text(encoding="utf-8")
    combined_css = f"/* tokens.css */\n{tokens_css}\n\n/* index.css */\n{index_css}"
    html = re.sub(
        r'<link rel="stylesheet" href="assets/css/tokens\.css" />\s*\n?\s*'
        r'<link rel="stylesheet" href="assets/css/index\.css" />',
        f"<style>\n{combined_css}\n</style>",
        html,
    )

    # 3. 内联 JS
    index_js = INDEX_JS.read_text(encoding="utf-8")
    html = html.replace(
        '<script src="assets/js/index.js"></script>',
        f"<script>\n{index_js}\n</script>",
    )

    # 4. Logo SVG → data URL
    svg_bytes = SVG_PATH.read_bytes()
    html = html.replace(
        "images/智优康赛logo.svg",
        b64(svg_bytes, "image/svg+xml"),
    )

    # 5. 7 个 AI 平台 PNG（缩到 88px）→ data URL
    for png in IMG_DIR.glob("*.png"):
        raw = png.read_bytes()
        try:
            small = resize_png_to_88(raw)
        except ImportError:
            small = raw
        html = html.replace(
            f"images/{png.name}",
            b64(small, "image/png"),
        )
        print(f"  {png.name}: {len(raw)//1024}KB -> {len(small)//1024}KB")

    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"\n输出: {OUT_HTML}")
    print(f"大小: {OUT_HTML.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
