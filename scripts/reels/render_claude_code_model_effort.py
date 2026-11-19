#!/usr/bin/env python3
"""Render the Claude Code model/effort reel from original typographic graphics.

Dependencies: Pillow, arabic-reshaper, python-bidi, fonttools, brotli,
imageio-ffmpeg. The accompanying master narration is kept at
media/reels/claude-code-model-effort-voiceover.mp3; scene durations below are
its sync points after voice editing.
"""
from __future__ import annotations

import argparse
import re
import subprocess
from functools import lru_cache
from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "reels"
MEDIA = ROOT / "media" / "reels"
WORK = MEDIA / ".claude-build"
W, H = 720, 1280
FPS = 24
SCENE_DURATIONS = [11.85, 18.83, 14.68, 16.06, 17.57, 14.25, 16.40, 19.02]
PAPER = (247, 244, 237)
CARD = (255, 253, 249)
INK = (37, 36, 33)
MUTED = (119, 113, 105)
TERRA = (184, 105, 82)
TERRA_PALE = (241, 226, 216)
LINE = (220, 214, 204)
GRID = (232, 226, 216)
WHITE = (255, 255, 255)
RESHAPER = arabic_reshaper.ArabicReshaper(configuration={"support_ligatures": False})

SCENES = [
    {"title": ["الموديل مش", "هو الجهد"], "sub": "اختيارين منفصلين", "kind": "choices", "en": "01 / THE CHOICE", "chapter_en": "Model / Effort", "chapter_ar": "قرارين منفصلين", "chapter_ms": "Model / Effort"},
    {"title": ["اختار النموذج", "على قد المهمة"], "sub": "كل نموذج له استخدامه", "kind": "models", "en": "02 / MODELS", "chapter_en": "Models", "chapter_ar": "النماذج", "chapter_ms": "Model"},
    {"title": ["الجهد مش", "موديل تاني"], "sub": "قد إيه تحليل تحتاجه؟", "kind": "effort", "en": "03 / EFFORT", "chapter_en": "Effort", "chapter_ar": "الجهد", "chapter_ms": "Effort"},
    {"title": ["تحكم من", "جوه الجلسة"], "sub": "أوامر واضحة، مش تخمين", "kind": "commands", "en": "04 / CONTROLS", "chapter_en": "Commands", "chapter_ar": "الأوامر", "chapter_ms": "Arahan"},
    {"title": ["خطة، تنفيذ،", "مراجعة"], "sub": "مثال عملي لمشروع كبير", "kind": "workflow", "en": "05 / WORKFLOW", "chapter_en": "Workflow", "chapter_ar": "سير العمل", "chapter_ms": "Aliran kerja"},
    {"title": ["قبل ما تغيّر", "الإعدادات"], "sub": "ابدأ بالسياق", "kind": "context", "en": "06 / CONTEXT", "chapter_en": "Context", "chapter_ar": "السياق", "chapter_ms": "Konteks"},
    {"title": ["قسّم الشغل", "بذكاء"], "sub": "وزّع المستقل وراجع الناتج", "kind": "agents", "en": "07 / SUBAGENTS", "chapter_en": "Agents", "chapter_ar": "الوكلاء", "chapter_ms": "Ejen"},
    {"title": ["قاعدة سريعة", "للاختيار"], "sub": "غيّر عامل واحد كل مرة", "kind": "rule", "en": "08 / QUICK RULE", "chapter_en": "Quick rule", "chapter_ar": "القاعدة السريعة", "chapter_ms": "Petua ringkas"},
]


def make_fonts() -> dict[str, Path]:
    out = WORK / "fonts"
    out.mkdir(parents=True, exist_ok=True)
    sources = {
        "ar_regular": ROOT / "public/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2",
        "ar_medium": ROOT / "public/fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2",
        "ar_bold": ROOT / "public/fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2",
        "latin": ROOT / "public/fonts/montserrat-latin-600-normal.woff2",
        "mono": ROOT / "public/fonts/jetbrains-mono-latin-500-normal.woff2",
    }
    result: dict[str, Path] = {}
    for name, source in sources.items():
        target = out / f"{name}.ttf"
        if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
            font = TTFont(source)
            font.flavor = None
            font.save(target)
        result[name] = target
    return result


FONT_PATHS = make_fonts()


@lru_cache(maxsize=128)
def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_PATHS[name]), size=size)


def arabic(text: str) -> str:
    return get_display(RESHAPER.reshape(text), base_dir="R")


def ar_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont) -> int:
    return int(draw.textbbox((0, 0), arabic(text), font=face)[2])


def draw_ar_center(draw: ImageDraw.ImageDraw, text: str, y: int, size: int,
                   color=INK, max_width=640, weight="ar_bold") -> None:
    face = font(weight, size)
    while ar_width(draw, text, face) > max_width and size > 24:
        size -= 2
        face = font(weight, size)
    shaped = arabic(text)
    box = draw.textbbox((0, 0), shaped, font=face)
    draw.text(((W - (box[2] - box[0])) // 2, y), shaped, font=face, fill=color)


def draw_ar_center_box(draw: ImageDraw.ImageDraw, text: str,
                       box: tuple[int, int, int, int], y: int, size: int,
                       color=INK, weight="ar_regular") -> None:
    face = font(weight, size)
    while ar_width(draw, text, face) > box[2] - box[0] - 24 and size > 20:
        size -= 2
        face = font(weight, size)
    shaped = arabic(text)
    bounds = draw.textbbox((0, 0), shaped, font=face)
    x = box[0] + (box[2] - box[0] - (bounds[2] - bounds[0])) // 2
    draw.text((x, y), shaped, font=face, fill=color)


def draw_ar_right(draw: ImageDraw.ImageDraw, text: str, right: int, y: int, size: int,
                  color=INK, weight="ar_regular") -> None:
    face = font(weight, size)
    shaped = arabic(text)
    box = draw.textbbox((0, 0), shaped, font=face)
    draw.text((right - (box[2] - box[0]), y), shaped, font=face, fill=color)


def draw_latin(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], size: int,
               color=INK, mono=False) -> None:
    draw.text(xy, text, font=font("mono" if mono else "latin", size), fill=color)


def rounded_card(image: Image.Image, box: tuple[int, int, int, int], radius=28,
                 fill=CARD, outline=LINE, width=2) -> None:
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    x1, y1, x2, y2 = box
    sd.rounded_rectangle((x1, y1 + 9, x2, y2 + 9), radius=radius,
                         fill=(36, 31, 27, 28))
    shadow = shadow.filter(ImageFilter.GaussianBlur(13))
    image.alpha_composite(shadow)
    d = ImageDraw.Draw(image)
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def base_scene(index: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    scene = SCENES[index]
    image = Image.new("RGBA", (W, H), PAPER + (255,))
    d = ImageDraw.Draw(image)
    # A quiet, editorial grid like the supplied reference, kept behind content.
    for x in range(48, 680, 80):
        for y in range(402, 1082, 80):
            d.ellipse((x - 1, y - 1, x + 1, y + 1), fill=GRID + (210,))
    draw_latin(d, "CLAUDE CODE", (56, 44), 18, color=MUTED)
    label_face = font("latin", 15)
    label_box = d.textbbox((0, 0), scene["en"], font=label_face)
    d.text((664 - (label_box[2] - label_box[0]), 47), scene["en"],
           font=label_face, fill=TERRA)
    d.line((56, 91, 664, 91), fill=LINE, width=2)
    d.line((56, 91, 144, 91), fill=TERRA, width=4)

    # Faint, cropped paper-disc ornament: an abstract original graphic, not a logo.
    d.ellipse((592, 116, 744, 268), fill=TERRA_PALE + (175,))
    d.ellipse((626, 150, 710, 234), outline=(228, 207, 192, 235), width=3)

    title_lines = scene["title"]
    start_y = 154 if len(title_lines) == 2 else 194
    for line_no, line in enumerate(title_lines):
        draw_ar_center(d, line, start_y + line_no * 72, 60, color=INK, max_width=646)
    draw_ar_center(d, scene["sub"], 306, 28, color=MUTED,
                   max_width=630, weight="ar_regular")

    # Chapter progress is a thin terracotta rule rather than a busy HUD.
    d.rounded_rectangle((56, 1150, 664, 1158), radius=4, fill=LINE)
    d.rounded_rectangle((56, 1150, 56 + int(608 * (index + 1) / len(SCENES)), 1158),
                        radius=4, fill=TERRA)
    chapter_count = f"{index + 1:02d} / 08"
    face = font("mono", 17)
    bbox = d.textbbox((0, 0), chapter_count, font=face)
    d.text(((W - (bbox[2] - bbox[0])) // 2, 1172), chapter_count,
           font=face, fill=MUTED)
    return image, d


def draw_choices(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    # RTL reading order: model on the right, effort on the left.
    for box, label, question, detail in [
        ((370, 414, 664, 748), "MODEL", "مين يشتغل؟", "اختيار النموذج"),
        ((56, 414, 350, 748), "EFFORT", "قد إيه يحلل؟", "عمق التفكير"),
    ]:
        rounded_card(image, box)
        d = ImageDraw.Draw(image)
        draw_latin(d, label, (box[0] + 28, 445), 20, color=TERRA)
        cx = (box[0] + box[2]) // 2
        d.ellipse((cx - 33, 500, cx + 33, 566), fill=TERRA_PALE)
        d.ellipse((cx - 17, 516, cx + 17, 550), fill=TERRA)
        draw_ar_center_box(d, question, box, 586, 34, color=INK, weight="ar_bold")
        draw_ar_center_box(d, detail, box, 655, 24, color=MUTED, weight="ar_regular")
    rounded_card(image, (104, 805, 616, 920), radius=24, fill=TERRA_PALE, outline=(232, 210, 195))
    d = ImageDraw.Draw(image)
    draw_ar_center(d, "مهمة واحدة، قرارين منفصلين", 840, 29, max_width=470)
    d.ellipse((346, 765, 374, 793), fill=TERRA)


def draw_models(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rows = [
        ("HAIKU", "مهام صغيرة وسريعة", TERRA),
        ("SONNET", "شغل يومي متوازن", INK),
        ("OPUS", "مسائل معقدة ومراجعة أعمق", TERRA),
    ]
    for i, (name, description, accent) in enumerate(rows):
        y = 414 + i * 198
        rounded_card(image, (56, y, 664, y + 160), radius=26)
        d = ImageDraw.Draw(image)
        d.rounded_rectangle((56, y + 24, 65, y + 136), radius=4, fill=accent)
        d.ellipse((94, y + 44, 160, y + 110), outline=TERRA_PALE, width=12)
        d.ellipse((113, y + 63, 141, y + 91), fill=accent)
        draw_latin(d, name, (188, y + 31), 23, color=accent)
        draw_ar_right(d, description, 625, y + 87, 29, color=INK, weight="ar_medium")
    draw_ar_center(d, "اختار على قد المهمة", 1030, 25, color=MUTED, weight="ar_regular")


def draw_effort(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rounded_card(image, (56, 420, 664, 574), radius=25, fill=WHITE)
    d = ImageDraw.Draw(image)
    draw_latin(d, "MODEL", (89, 444), 19, color=MUTED)
    draw_latin(d, "SONNET", (89, 483), 28, color=INK)
    draw_ar_right(d, "الموديل ثابت", 625, 468, 27, color=MUTED)

    rounded_card(image, (56, 612, 664, 930), radius=28, fill=CARD)
    d = ImageDraw.Draw(image)
    draw_latin(d, "EFFORT", (92, 645), 20, color=TERRA)
    draw_ar_right(d, "مستوى التفكير", 625, 641, 27, color=INK, weight="ar_medium")
    d.rounded_rectangle((112, 754, 608, 768), radius=7, fill=LINE)
    d.rounded_rectangle((112, 754, 474, 768), radius=7, fill=TERRA)
    for cx, label, active in [(125, "LOW", False), (360, "MEDIUM", False), (595, "HIGH", True)]:
        r = 23 if active else 16
        d.ellipse((cx - r, 746 - r + 8, cx + r, 746 + r + 8),
                  fill=TERRA if active else CARD,
                  outline=TERRA if active else LINE, width=4)
        draw_latin(d, label, (cx - 37, 811), 14, color=TERRA if active else MUTED)
    draw_ar_center(d, "ارفعه لما المهمة تستاهل", 866, 27, max_width=540)
    rounded_card(image, (120, 982, 600, 1060), radius=22, fill=TERRA_PALE, outline=(232, 210, 195))
    d = ImageDraw.Draw(image)
    draw_ar_center(d, "جهد أكتر مش بديل عن سياق واضح", 1004, 23, max_width=440, weight="ar_regular")


def draw_commands(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rows = [("/model", "اختيار النموذج"), ("/effort high", "رفع مستوى الجهد")]
    for i, (command, description) in enumerate(rows):
        y = 430 + i * 195
        rounded_card(image, (56, y, 664, y + 154), radius=24)
        d = ImageDraw.Draw(image)
        d.rounded_rectangle((56, y + 25, 65, y + 129), radius=4, fill=TERRA)
        draw_latin(d, command, (94, y + 46), 24, color=INK, mono=True)
        draw_ar_right(d, description, 625, y + 94, 26, color=MUTED)
    rounded_card(image, (56, 836, 664, 1017), radius=24, fill=(241, 235, 225), outline=LINE)
    d = ImageDraw.Draw(image)
    draw_latin(d, "NEW SESSION", (88, 858), 16, color=TERRA)
    draw_latin(d, "claude --model sonnet", (88, 902), 20, color=INK, mono=True)
    draw_latin(d, "--effort high", (88, 938), 20, color=INK, mono=True)
    draw_ar_right(d, "من الطرفية", 625, 970, 21, color=MUTED)


def draw_workflow(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rows = [
        ("01", "PLAN", "افهم المشكلة وحدد الأثر"),
        ("02", "BUILD", "نفذ على دفعات وشغل الاختبارات"),
        ("03", "REVIEW", "راجع الفرق والمخاطر"),
    ]
    for i, (number, label, description) in enumerate(rows):
        y = 414 + i * 192
        rounded_card(image, (56, y, 664, y + 150), radius=25)
        d = ImageDraw.Draw(image)
        d.ellipse((88, y + 45, 145, y + 102), fill=TERRA_PALE)
        draw_latin(d, number, (98, y + 61), 17, color=TERRA, mono=True)
        draw_latin(d, label, (172, y + 39), 19, color=INK)
        draw_ar_right(d, description, 625, y + 91, 25, color=MUTED, weight="ar_regular")
        if i < 2:
            d.line((116, y + 151, 116, y + 188), fill=TERRA, width=4)
            d.ellipse((108, y + 177, 124, y + 193), fill=TERRA)
    draw_ar_center(d, "مثال عملي، مش قاعدة ثابتة", 1022, 25, color=MUTED, weight="ar_regular")


def draw_context(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rounded_card(image, (56, 420, 664, 892), radius=28)
    d = ImageDraw.Draw(image)
    draw_latin(d, "CONTEXT", (88, 448), 18, color=TERRA)
    # A deliberately untidy set of task inputs on the right.
    d.rounded_rectangle((364, 520, 604, 590), radius=16, fill=(242, 233, 222), outline=LINE, width=2)
    d.rounded_rectangle((322, 612, 575, 682), radius=16, fill=WHITE, outline=LINE, width=2)
    d.rounded_rectangle((382, 704, 613, 774), radius=16, fill=TERRA_PALE, outline=(232, 210, 195), width=2)
    draw_ar_right(d, "الطلب", 574, 541, 26, color=INK)
    draw_ar_right(d, "الملفات", 545, 633, 26, color=INK)
    draw_ar_right(d, "الاختبارات", 583, 725, 26, color=INK)
    # The terracotta arrow points into the organized brief.
    d.line((287, 635, 194, 635), fill=TERRA, width=6)
    d.polygon([(184, 635), (207, 622), (207, 648)], fill=TERRA)
    d.rounded_rectangle((92, 537, 246, 743), radius=20, fill=CARD, outline=LINE, width=2)
    d.line((119, 584, 217, 584), fill=LINE, width=6)
    d.line((119, 624, 217, 624), fill=TERRA, width=6)
    d.line((119, 664, 201, 664), fill=LINE, width=6)
    d.line((119, 704, 213, 704), fill=LINE, width=6)
    draw_ar_center(d, "سياق مرتب", 783, 23, color=MUTED, weight="ar_regular")
    rounded_card(image, (83, 945, 637, 1050), radius=22, fill=TERRA_PALE, outline=(232, 210, 195))
    d = ImageDraw.Draw(image)
    draw_ar_center(d, "راجع السياق قبل ما تزود الجهد", 979, 24, max_width=510)


def draw_agents(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rounded_card(image, (134, 416, 586, 574), radius=26, fill=WHITE)
    d = ImageDraw.Draw(image)
    draw_latin(d, "MAIN TASK", (172, 444), 18, color=TERRA)
    draw_ar_right(d, "المهمة الأساسية", 548, 490, 29, color=INK, weight="ar_medium")
    # Branch line from one task into two independent paths.
    d.line((360, 574, 360, 624), fill=TERRA, width=4)
    d.line((188, 624, 532, 624), fill=TERRA, width=4)
    d.line((188, 624, 188, 658), fill=TERRA, width=4)
    d.line((532, 624, 532, 658), fill=TERRA, width=4)
    for box, title in [((76, 658, 346, 818), "استكشاف"), ((374, 658, 644, 818), "مراجعة")]:
        rounded_card(image, box, radius=24)
        d = ImageDraw.Draw(image)
        d.ellipse((box[0] + 28, box[1] + 35, box[0] + 78, box[1] + 85), fill=TERRA_PALE)
        d.ellipse((box[0] + 43, box[1] + 50, box[0] + 63, box[1] + 70), fill=TERRA)
        draw_ar_right(d, title, box[2] - 28, box[1] + 88, 27, color=INK)
    d.line((360, 818, 360, 870), fill=TERRA, width=4)
    rounded_card(image, (110, 870, 610, 1026), radius=24, fill=(241, 235, 225), outline=LINE)
    d = ImageDraw.Draw(image)
    draw_latin(d, "CHECK THE SUMMARY", (148, 893), 16, color=TERRA)
    draw_ar_right(d, "راجع النتائج واجمعها", 574, 944, 26, color=INK)
    draw_ar_center(d, "المهام المستقلة بس", 986, 21, color=MUTED, weight="ar_regular")


def draw_rule(image: Image.Image, d: ImageDraw.ImageDraw) -> None:
    rows = [
        ("SMALL", "مهمة صغيرة", "ابدأ بنموذج سريع"),
        ("DAILY", "شغل يومي", "اختيار متوازن"),
        ("COMPLEX", "مسألة معقدة", "نموذج أقوى أو جهد أعلى"),
    ]
    for i, (tag, situation, action) in enumerate(rows):
        y = 418 + i * 185
        fill = TERRA_PALE if i == 2 else CARD
        rounded_card(image, (56, y, 664, y + 148), radius=24, fill=fill,
                     outline=(232, 210, 195) if i == 2 else LINE)
        d = ImageDraw.Draw(image)
        draw_latin(d, tag, (88, y + 27), 17, color=TERRA)
        draw_ar_right(d, situation, 625, y + 25, 25, color=MUTED, weight="ar_regular")
        draw_ar_right(d, action, 625, y + 76, 29, color=INK, weight="ar_bold")
    d = ImageDraw.Draw(image)
    draw_ar_center(d, "لو الرد مش واضح، حسّن السياق الأول", 1002, 24, color=MUTED, weight="ar_regular")


DRAWERS = [draw_choices, draw_models, draw_effort, draw_commands,
           draw_workflow, draw_context, draw_agents, draw_rule]


def save_scene_images() -> list[Path]:
    images_dir = WORK / "visuals"
    images_dir.mkdir(parents=True, exist_ok=True)
    posters = []
    for i, draw_scene in enumerate(DRAWERS):
        image, draw = base_scene(i)
        draw_scene(image, draw)
        rgb = image.convert("RGB")
        png_path = images_dir / f"scene-{i + 1:02d}.png"
        rgb.save(png_path, optimize=True)
        poster_path = PUBLIC / f"claude-code-model-effort-{i + 1:02d}.webp"
        rgb.resize((540, 960), Image.Resampling.LANCZOS).save(
            poster_path, "WEBP", quality=91, method=6
        )
        posters.append(png_path)
    return posters


def probe_duration(ffmpeg: str, path: Path) -> float:
    proc = subprocess.run([ffmpeg, "-hide_banner", "-i", str(path), "-f", "null", "-"],
                          capture_output=True, text=True, check=False)
    match = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", proc.stderr)
    if not match:
        raise RuntimeError(f"Could not read duration for {path}: {proc.stderr[-400:]}")
    return int(match.group(1)) * 3600 + int(match.group(2)) * 60 + float(match.group(3))


def render_scene_video(ffmpeg: str, scene: Path, out: Path, duration: float) -> int:
    frames = max(1, round(duration * FPS))
    exact_duration = frames / FPS
    fade = min(0.14, exact_duration / 6)
    fade_out = max(0, exact_duration - fade)
    zoom = (
        "zoompan=z='1+0.018*min(on/480,1)':"
        "x='(iw-iw/zoom)/2+5*sin(on/150)':"
        "y='(ih-ih/zoom)/2+4*sin(on/190)':"
        f"d=1:s={W}x{H}:fps={FPS},"
        f"fade=t=in:st=0:d={fade:.4f}:color=0xf7f4ed,"
        f"fade=t=out:st={fade_out:.4f}:d={fade:.4f}:color=0xf7f4ed,"
        "format=yuv420p"
    )
    cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
           "-loop", "1", "-framerate", str(FPS), "-i", str(scene),
           "-vf", zoom, "-frames:v", str(frames), "-an",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
           "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart",
           str(out)]
    subprocess.run(cmd, check=True)
    return frames


def build_reel(posters: list[Path]) -> tuple[Path, float, list[int]]:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    voiceover = MEDIA / "claude-code-model-effort-voiceover.mp3"
    if not voiceover.exists():
        raise FileNotFoundError(f"Missing master narration: {voiceover}")
    if len(posters) != len(SCENE_DURATIONS):
        raise ValueError("Poster count must match the scene duration list")
    voice_duration = probe_duration(ffmpeg, voiceover)
    if abs(sum(SCENE_DURATIONS) - voice_duration) > 0.8:
        raise ValueError("Scene timing does not match the master voiceover duration")

    clip_dir = WORK / "clips"
    clip_dir.mkdir(parents=True, exist_ok=True)
    clips = []
    chapters = []
    cursor = 0
    for index, (poster, duration) in enumerate(zip(posters, SCENE_DURATIONS), start=1):
        chapters.append(round(cursor / FPS))
        clip = clip_dir / f"scene-{index:02d}.mp4"
        frames = render_scene_video(ffmpeg, poster, clip, duration)
        cursor += frames
        clips.append(clip)

    concat_list = WORK / "video-concat.txt"
    concat_list.write_text("\n".join(f"file '{p.as_posix()}'" for p in clips) + "\n")
    video_only = WORK / "video-only.mp4"
    subprocess.run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
                    "-f", "concat", "-safe", "0", "-i", str(concat_list),
                    "-c", "copy", "-movflags", "+faststart", str(video_only)], check=True)
    final = PUBLIC / "claude-code-model-effort.mp4"
    subprocess.run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
                    "-i", str(video_only), "-i", str(voiceover),
                    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
                    "-shortest", "-movflags", "+faststart", str(final)], check=True)
    return final, voice_duration, chapters


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--posters-only", action="store_true",
                        help="render poster images without rebuilding the video")
    args = parser.parse_args()
    PUBLIC.mkdir(parents=True, exist_ok=True)
    MEDIA.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    posters = save_scene_images()
    if args.posters_only:
        print(f"Rendered {len(posters)} scene posters")
        return
    final, duration, chapters = build_reel(posters)
    print(f"Rendered {final} ({duration:.2f}s)")
    print("Chapter starts (seconds):", chapters)


if __name__ == "__main__":
    main()
