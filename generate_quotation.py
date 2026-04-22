#!/usr/bin/env python3
"""Generate Ictinus Contractors painting quotation PDF."""

from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage
import io, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(SCRIPT_DIR, 'quotation_painting.pdf')
LOGO_PATH = os.path.join(SCRIPT_DIR, 'public', 'logo2.png')

W, H = A4  # 595.27 x 841.89 pt

# Brand colours
HEADER_BG    = HexColor('#3D2B1E')
GOLD         = HexColor('#C5A048')
GOLD_BOLD    = HexColor('#B8922A')
SLATE        = HexColor('#3A3A3A')
BODY_GREY    = HexColor('#5A5A5A')
LABEL_GREY   = HexColor('#9A9A9A')
BORDER       = HexColor('#C8B070')
RULE_LIGHT   = HexColor('#D8C898')

LM = 22 * mm   # left margin
RM = 22 * mm   # right margin
CW = W - LM - RM

HEADER_H = 76   # pt

# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────

def logo_reader():
    """Return an ImageReader with the logo composited on the header bg colour."""
    img = PILImage.open(LOGO_PATH).convert('RGBA')
    bg  = PILImage.new('RGBA', img.size, (61, 43, 30, 255))
    bg.paste(img, mask=img.split()[3])
    buf = io.BytesIO()
    bg.convert('RGB').save(buf, format='PNG')
    buf.seek(0)
    return ImageReader(buf)


def wrap_text(c, text, font, size, max_w):
    """Return list of lines that fit within max_w points."""
    words   = text.split()
    lines   = []
    current = []
    for w in words:
        test = ' '.join(current + [w])
        if c.stringWidth(test, font, size) <= max_w:
            current.append(w)
        else:
            if current:
                lines.append(' '.join(current))
            current = [w]
    if current:
        lines.append(' '.join(current))
    return lines


def diamond(c, cx, cy, sz=3.2):
    """Draw a filled gold diamond centred at (cx, cy)."""
    p = c.beginPath()
    p.moveTo(cx,      cy + sz)
    p.lineTo(cx + sz, cy)
    p.lineTo(cx,      cy - sz)
    p.lineTo(cx - sz, cy)
    p.close()
    prev = c._fillColorObj
    c.setFillColor(GOLD)
    c.drawPath(p, fill=1, stroke=0)
    c.setFillColor(prev)


# ─────────────────────────────────────────────────────────────
# Page-level chrome
# ─────────────────────────────────────────────────────────────

def draw_header(c):
    # Dark background
    c.setFillColor(HEADER_BG)
    c.rect(0, H - HEADER_H, W, HEADER_H, fill=1, stroke=0)

    # Gold accent line along bottom of header
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.8)
    c.line(0, H - HEADER_H, W, H - HEADER_H)

    # Logo
    logo_sz = 52
    logo_x  = LM
    logo_y  = H - HEADER_H + (HEADER_H - logo_sz) / 2
    try:
        c.drawImage(logo_reader(), logo_x, logo_y, width=logo_sz, height=logo_sz,
                    preserveAspectRatio=True, mask='auto')
        tx = logo_x + logo_sz + 11
    except Exception:
        tx = LM

    # "ICTINUS" – large tracked gold text
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 23)
    t1 = c.beginText(tx, H - HEADER_H / 2 + 5)
    t1.setCharSpace(3.5)
    t1.setFillColor(GOLD)
    t1.setFont('Helvetica-Bold', 23)
    t1.textLine('ICTINUS')
    c.drawText(t1)

    # "CONTRACTORS" – smaller white text
    t2 = c.beginText(tx, H - HEADER_H / 2 - 11)
    t2.setCharSpace(2.5)
    t2.setFillColor(white)
    t2.setFont('Helvetica', 10)
    t2.textLine('CONTRACTORS')
    c.drawText(t2)

    # Reset character spacing to 0 so it doesn't bleed into body text
    t_reset = c.beginText(0, 0)
    t_reset.setCharSpace(0)
    c.drawText(t_reset)


def draw_footer(c):
    fy = 18
    c.setStrokeColor(RULE_LIGHT)
    c.setLineWidth(0.4)
    c.line(LM, fy + 14, W - RM, fy + 14)

    footer = ('Ictinus Contractors  ·  07586 480417  ·  '
              'info@ictinuscontractors.co.uk  ·  ictinuscontractors.co.uk')
    c.setFillColor(LABEL_GREY)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, fy + 4, footer)
    c.drawRightString(W - RM, fy + 4, 'Page 1')


# ─────────────────────────────────────────────────────────────
# Content sections
# ─────────────────────────────────────────────────────────────

def draw_title_box(c, y):
    pad_top = 14
    bh      = 38
    by      = y - pad_top - bh

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.9)
    c.rect(LM, by, CW, bh, fill=0, stroke=1)

    # Inner thin gold line offset
    offset = 3
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.4)
    c.rect(LM + offset, by + offset, CW - offset * 2, bh - offset * 2, fill=0, stroke=1)

    c.setFillColor(SLATE)
    c.setFont('Times-Bold', 13.5)
    c.drawCentredString(W / 2, by + bh / 2 - 5, 'Quotation for Interior / Exterior Painting Works')

    return by - 12


def draw_info_grid(c, y):
    col_gap = 6
    cw      = (CW - col_gap) / 2
    gh      = 76

    left_x  = LM
    right_x = LM + cw + col_gap

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.rect(left_x,  y - gh, cw, gh, fill=0, stroke=1)
    c.rect(right_x, y - gh, cw, gh, fill=0, stroke=1)

    pad = 9

    # Left – Contractor
    lx = left_x + pad
    t = c.beginText(lx, y - 13)
    t.setCharSpace(1)
    t.setFillColor(LABEL_GREY)
    t.setFont('Helvetica', 6.5)
    t.textLine('CONTRACTOR')
    c.drawText(t)

    c.setFillColor(SLATE)
    c.setFont('Helvetica', 9)
    left_lines = [
        'Ictinus Contractors',
        '07586 480417',
        'info@ictinuscontractors.co.uk',
    ]
    for i, line in enumerate(left_lines):
        c.drawString(lx, y - 26 - i * 13, line)

    # Right – Property / Reference
    rx = right_x + pad
    t = c.beginText(rx, y - 13)
    t.setCharSpace(1)
    t.setFillColor(LABEL_GREY)
    t.setFont('Helvetica', 6.5)
    t.textLine('PROPERTY / REFERENCE')
    c.drawText(t)

    c.setFillColor(SLATE)
    c.setFont('Helvetica', 9)
    right_lines = [
        'Interior and exterior painting works for',
        'property located in Hornsey, London',
        'Quote date: 22 April 2026',
    ]
    for i, line in enumerate(right_lines):
        c.drawString(rx, y - 26 - i * 13, line)

    return y - gh - 16


def section_heading(c, y, text):
    c.setFillColor(GOLD)
    c.setFont('Times-BoldItalic', 13.5)
    c.drawString(LM, y, text)
    y -= 6
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(LM, y, LM + CW, y)
    return y - 13


def draw_scope(c, y):
    y = section_heading(c, y, 'Scope of Works')

    items = [
        'Prepare and paint door and frame on both sides.',
        'Carry out sanding and use wood filler where required.',
        'Apply undercoat to door and frame.',
        'Paint exterior frame white using Dulux Weathershield.',
        'Paint exterior side of door using Dulux Weathershield, colour matched.',
        'Paint interior side of door and frame in white using Dulux Trade Heritage True White.',
        'Paint step in black.',
        'All materials to be quick-dry and water-based.',
    ]

    bullet_cx = LM + 7
    text_x    = LM + 19
    text_w    = CW - 23

    for item in items:
        lines = wrap_text(c, item, 'Helvetica', 9.5, text_w)
        diamond(c, bullet_cx, y + 2.5)
        c.setFillColor(SLATE)
        c.setFont('Helvetica', 9.5)
        for j, ln in enumerate(lines):
            c.drawString(text_x, y - j * 13, ln)
        y -= len(lines) * 13 + 4

    return y - 8


def draw_pricing(c, y):
    y = section_heading(c, y, 'Pricing')

    # Line item
    c.setFillColor(SLATE)
    c.setFont('Helvetica', 9.5)
    c.drawString(LM + 5, y, 'Labour and materials')
    c.drawRightString(LM + CW, y, '£1,080.00')

    y -= 9
    c.setStrokeColor(RULE_LIGHT)
    c.setLineWidth(0.5)
    c.line(LM, y, LM + CW, y)
    y -= 15

    # Total row
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Bold', 10.5)
    c.drawString(LM + 5, y, 'Total Quotation Amount')

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 14)
    c.drawRightString(LM + CW, y, '£1,080.00')

    y -= 9
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.9)
    c.line(LM, y, LM + CW, y)

    return y - 16


def draw_pricing_note(c, y):
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(LM, y, 'Pricing Note')
    y -= 13

    note = ('This price includes all materials required for the job, '
            'supplied by Ictinus Contractors.')
    lines = wrap_text(c, note, 'Helvetica', 8.5, CW - 4)
    c.setFillColor(BODY_GREY)
    c.setFont('Helvetica', 8.5)
    for ln in lines:
        c.drawString(LM, y, ln)
        y -= 12

    y -= 10

    c.setFillColor(SLATE)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(LM, y, 'Additional Materials Information')
    y -= 13

    intro = ('For reference, materials supplied separately would be approximately '
             '£300.00 and may include:')
    lines = wrap_text(c, intro, 'Helvetica', 8.5, CW - 4)
    c.setFillColor(BODY_GREY)
    c.setFont('Helvetica', 8.5)
    for ln in lines:
        c.drawString(LM, y, ln)
        y -= 12

    materials = ['Dulux Trade paints', 'Masking tape', 'Wood filler']
    for mat in materials:
        diamond(c, LM + 7, y + 2.5)
        c.setFillColor(BODY_GREY)
        c.setFont('Helvetica', 8.5)
        c.drawString(LM + 17, y, mat)
        y -= 12

    return y - 10


def draw_important_note(c, y):
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(LM, y, 'Important Note')
    y -= 13

    text = ('This quotation includes labour and materials and is based on the information '
            'currently available. Should any additional works be identified outside the scope '
            'outlined above, these would be discussed prior to commencement.')
    lines = wrap_text(c, text, 'Helvetica', 8, CW - 12)
    c.setFillColor(BODY_GREY)
    c.setFont('Helvetica', 8)
    for ln in lines:
        c.drawString(LM, y, ln)
        y -= 11

    return y - 10


def draw_signoff(c, y):
    c.setStrokeColor(RULE_LIGHT)
    c.setLineWidth(0.5)
    c.line(LM, y, LM + CW, y)
    y -= 18

    c.setFillColor(SLATE)
    c.setFont('Helvetica', 9.5)
    c.drawString(LM, y, 'Kind regards,')
    y -= 18

    c.setFont('Helvetica-Bold', 10)
    c.drawString(LM, y, 'Ictinus Contractors')


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────

def generate():
    c = pdfcanvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle('Quotation – Ictinus Contractors')
    c.setAuthor('Ictinus Contractors')

    draw_header(c)
    draw_footer(c)

    y = H - HEADER_H   # top of usable content area

    y = draw_title_box(c, y)
    y = draw_info_grid(c, y)
    y = draw_scope(c, y)
    y = draw_pricing(c, y)
    y = draw_pricing_note(c, y)
    y = draw_important_note(c, y)
    draw_signoff(c, y)

    c.save()
    print(f'PDF written: {OUTPUT}')


if __name__ == '__main__':
    generate()
