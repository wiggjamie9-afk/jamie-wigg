#!/usr/bin/env python3
"""Generate professional 3000x3000 podcast cover art for the STARLIGHTMIX audio network.
Pure-local SVG -> PNG via cairosvg. No network egress required.
Run:  python3 make-covers.py [NN]   (NN optional, render a single show)
"""
import cairosvg, os, html, math

OUT = os.path.join(os.path.dirname(__file__), "covers")
os.makedirs(OUT, exist_ok=True)
S = 3000

SHOWS = {
 "01": dict(slug="true-crime-brief", title=["TRUE CRIME","BRIEF"], cat="INVESTIGATION",
            tag="One case. Twelve minutes. The whole story.",
            c1="#1a0708", c2="#3a0d12", accent="#ff3b4e", accent2="#ff8a6b", glyph="crime"),
 "02": dict(slug="ai-briefing", title=["AI","BRIEFING"], cat="TECHNOLOGY",
            tag="The day in AI, in plain English.",
            c1="#04080f", c2="#0a1a2e", accent="#29b6ff", accent2="#6ad8ff", glyph="ai"),
 "03": dict(slug="dating-decoded", title=["DATING","DECODED"], cat="RELATIONSHIPS",
            tag="The psychology of modern love, decoded.",
            c1="#1a0610", c2="#2e0a22", accent="#ff4d8d", accent2="#ff9ec4", glyph="dating"),
 "04": dict(slug="side-hustle-school", title=["SIDE HUSTLE","SCHOOL"], cat="BUSINESS",
            tag="Build income on the side, one playbook at a time.",
            c1="#04130d", c2="#0a2a1c", accent="#1fd17a", accent2="#8ff0c0", glyph="hustle"),
 "05": dict(slug="dad-code", title=["DAD","CODE"], cat="FATHERHOOD",
            tag="Real talk on fatherhood, no sugar-coating.",
            c1="#0a0f16", c2="#16263a", accent="#ff8a3d", accent2="#ffd0a3", glyph="code"),
 "06": dict(slug="money-mindset", title=["MONEY","MINDSET"], cat="PERSONAL FINANCE",
            tag="Rewire how you think about money.",
            c1="#05140c", c2="#0c2a1a", accent="#ffd23f", accent2="#fff0a8", glyph="coin"),
 "07": dict(slug="sleep-and-calm", title=["SLEEP","& CALM"], cat="WELLNESS",
            tag="Wind down, switch off, sleep deep.",
            c1="#060814", c2="#0e1430", accent="#8a7dff", accent2="#c4bcff", glyph="moon"),
 "08": dict(slug="longevity-brief", title=["LONGEVITY","BRIEF"], cat="HEALTH",
            tag="The science of living longer and better.",
            c1="#03140f", c2="#08281f", accent="#2fe0c0", accent2="#a8f4e4", glyph="pulse"),
 "09": dict(slug="history-uncovered", title=["HISTORY","UNCOVERED"], cat="HISTORY",
            tag="The gripping stories school never told you.",
            c1="#14100a", c2="#2a2012", accent="#e0a83f", accent2="#f4d79a", glyph="column"),
 "10": dict(slug="unexplained", title=["UNEXPLAINED"], cat="MYSTERY",
            tag="Mysteries that refuse to be solved.",
            c1="#0b0614", c2="#1a0e30", accent="#b06bff", accent2="#d8b8ff", glyph="eye"),
 "11": dict(slug="pop-culture-now", title=["POP CULTURE","NOW"], cat="ENTERTAINMENT",
            tag="Everything everyone's talking about, today.",
            c1="#16061a", c2="#2e0a30", accent="#ff45c8", accent2="#ffa3e8", glyph="star"),
 "12": dict(slug="stoic-minute", title=["STOIC","MINUTE"], cat="PHILOSOPHY",
            tag="Ancient wisdom for a calmer modern mind.",
            c1="#0c0d10", c2="#1c1e24", accent="#c9a86a", accent2="#e8d8b8", glyph="pillar"),
 "13": dict(slug="focus-lab", title=["FOCUS","LAB"], cat="PRODUCTIVITY",
            tag="Sharpen your attention in one sitting.",
            c1="#140c04", c2="#2a1a08", accent="#ff9a1f", accent2="#ffd49a", glyph="target"),
 "14": dict(slug="parenting-playbook", title=["PARENTING","PLAYBOOK"], cat="PARENTING",
            tag="Field-tested answers for raising kids.",
            c1="#04121a", c2="#0a2632", accent="#ff6f61", accent2="#ffc1b8", glyph="book"),
 "15": dict(slug="sports-unfiltered", title=["SPORTS","UNFILTERED"], cat="SPORTS",
            tag="Sports talk with the gloves off.",
            c1="#120406", c2="#28080c", accent="#ff2e3e", accent2="#ff8a6b", glyph="trophy"),
 "16": dict(slug="plain-tech", title=["PLAIN","TECH"], cat="TECHNOLOGY",
            tag="Technology explained without the jargon.",
            c1="#060c14", c2="#0c1c2e", accent="#4d9fff", accent2="#a8d0ff", glyph="chip"),
 "17": dict(slug="founders-stories", title=["FOUNDERS'","STORIES"], cat="STARTUPS",
            tag="How the builders actually built it.",
            c1="#07091a", c2="#0e1636", accent="#5d8bff", accent2="#ffd23f", glyph="rocket"),
 "18": dict(slug="calm-mind", title=["CALM","MIND"], cat="MEDITATION",
            tag="A few quiet minutes to reset your mind.",
            c1="#04140f", c2="#0a281f", accent="#3fd6a8", accent2="#bff0dc", glyph="lotus"),
 "19": dict(slug="fifteen-minute-kitchen", title=["15-MINUTE","KITCHEN"], cat="FOOD",
            tag="Real dinners, start to finish, in fifteen.",
            c1="#160806", c2="#2e1008", accent="#ff7a3d", accent2="#ffc79a", glyph="fork"),
 "20": dict(slug="wanderlust", title=["WANDERLUST"], cat="TRAVEL",
            tag="Far-flung places and how to go.",
            c1="#04121a", c2="#0a2832", accent="#2fc4c4", accent2="#ffb37a", glyph="compass"),
}

def glyph_svg(kind, cx, cy, r, a, a2):
    if kind=="crime":
        arcs="".join(f'<circle cx="{cx}" cy="{cy}" r="{r*0.30+i*r*0.13:.0f}" fill="none" stroke="{a}" stroke-width="9" stroke-opacity="{0.18+0.10*i:.2f}"/>' for i in range(4))
        gx,gy=cx+r*0.28, cy+r*0.30
        return f'{arcs}<circle cx="{gx:.0f}" cy="{gy:.0f}" r="{r*0.34:.0f}" fill="none" stroke="{a}" stroke-width="22"/><line x1="{gx+r*0.24:.0f}" y1="{gy+r*0.24:.0f}" x2="{gx+r*0.62:.0f}" y2="{gy+r*0.62:.0f}" stroke="{a}" stroke-width="30" stroke-linecap="round"/>'
    if kind=="ai":
        lines=""; circs=f'<circle cx="{cx}" cy="{cy}" r="34" fill="{a}"/>'
        for i in range(6):
            ang=math.radians(i*60-90); nx=cx+math.cos(ang)*r*0.7; ny=cy+math.sin(ang)*r*0.7
            lines+=f'<line x1="{cx}" y1="{cy}" x2="{nx:.0f}" y2="{ny:.0f}" stroke="{a}" stroke-width="10" stroke-opacity="0.55"/>'
            circs+=f'<circle cx="{nx:.0f}" cy="{ny:.0f}" r="26" fill="none" stroke="{a}" stroke-width="14"/>'
        return lines+circs
    if kind=="dating":
        dx=r*0.34
        return f'<circle cx="{cx-dx:.0f}" cy="{cy}" r="{r*0.55:.0f}" fill="none" stroke="{a}" stroke-width="20"/><circle cx="{cx+dx:.0f}" cy="{cy}" r="{r*0.55:.0f}" fill="none" stroke="{a2}" stroke-width="20"/><path d="M {cx} {cy+r*0.20:.0f} C {cx-r*0.30:.0f} {cy-r*0.18:.0f}, {cx-r*0.06:.0f} {cy-r*0.42:.0f}, {cx} {cy-r*0.14:.0f} C {cx+r*0.06:.0f} {cy-r*0.42:.0f}, {cx+r*0.30:.0f} {cy-r*0.18:.0f}, {cx} {cy+r*0.20:.0f} Z" fill="{a}"/>'
    if kind=="hustle":
        bars="".join(f'<rect x="{cx-r*0.6+i*r*0.42:.0f}" y="{cy+r*0.5-h:.0f}" width="{r*0.26:.0f}" height="{h:.0f}" rx="8" fill="{a}" fill-opacity="{0.5+0.16*i:.2f}"/>' for i,h in enumerate([r*0.45,r*0.7,r*0.95]))
        return bars+f'<path d="M {cx-r*0.5:.0f} {cy-r*0.1:.0f} L {cx+r*0.55:.0f} {cy-r*0.6:.0f}" stroke="{a2}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M {cx+r*0.2:.0f} {cy-r*0.6:.0f} L {cx+r*0.55:.0f} {cy-r*0.6:.0f} L {cx+r*0.55:.0f} {cy-r*0.22:.0f}" stroke="{a2}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    if kind=="code":
        return f'<path d="M {cx} {cy-r*0.8:.0f} L {cx+r*0.62:.0f} {cy-r*0.5:.0f} L {cx+r*0.62:.0f} {cy+r*0.15:.0f} Q {cx+r*0.62:.0f} {cy+r*0.6:.0f} {cx} {cy+r*0.85:.0f} Q {cx-r*0.62:.0f} {cy+r*0.6:.0f} {cx-r*0.62:.0f} {cy+r*0.15:.0f} L {cx-r*0.62:.0f} {cy-r*0.5:.0f} Z" fill="none" stroke="{a}" stroke-width="20" stroke-linejoin="round"/><path d="M {cx-r*0.12:.0f} {cy-r*0.25:.0f} L {cx-r*0.34:.0f} {cy:.0f} L {cx-r*0.12:.0f} {cy+r*0.25:.0f}" fill="none" stroke="{a2}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M {cx+r*0.12:.0f} {cy-r*0.25:.0f} L {cx+r*0.34:.0f} {cy:.0f} L {cx+r*0.12:.0f} {cy+r*0.25:.0f}" fill="none" stroke="{a2}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>'
    if kind=="coin":
        return f'<circle cx="{cx}" cy="{cy}" r="{r*0.7:.0f}" fill="none" stroke="{a}" stroke-width="22"/><circle cx="{cx}" cy="{cy}" r="{r*0.55:.0f}" fill="none" stroke="{a}" stroke-width="6" stroke-opacity="0.5"/><text x="{cx}" y="{cy+r*0.32:.0f}" fill="{a}" font-family="DejaVu Sans" font-weight="bold" font-size="{r*0.9:.0f}" text-anchor="middle">$</text>'
    if kind=="moon":
        stars="".join(f'<circle cx="{cx+r*x:.0f}" cy="{cy+r*y:.0f}" r="{r*s:.0f}" fill="{a2}"/>' for x,y,s in [(0.55,-0.45,0.05),(0.7,0.1,0.035),(0.4,0.5,0.045)])
        return f'<path d="M {cx+r*0.35:.0f} {cy-r*0.65:.0f} A {r*0.7:.0f} {r*0.7:.0f} 0 1 0 {cx+r*0.35:.0f} {cy+r*0.65:.0f} A {r*0.55:.0f} {r*0.55:.0f} 0 1 1 {cx+r*0.35:.0f} {cy-r*0.65:.0f} Z" fill="{a}"/>'+stars
    if kind=="pulse":
        return f'<polyline points="{cx-r*0.8:.0f},{cy} {cx-r*0.4:.0f},{cy} {cx-r*0.25:.0f},{cy-r*0.5:.0f} {cx-r*0.02:.0f},{cy+r*0.55:.0f} {cx+r*0.2:.0f},{cy-r*0.25:.0f} {cx+r*0.35:.0f},{cy} {cx+r*0.8:.0f},{cy}" fill="none" stroke="{a}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>'
    if kind in ("column","pillar"):
        top=cy-r*0.7; bot=cy+r*0.7; w=r*0.5
        flutes="".join(f'<line x1="{cx-w+i*(2*w/4):.0f}" y1="{top+r*0.18:.0f}" x2="{cx-w+i*(2*w/4):.0f}" y2="{bot-r*0.18:.0f}" stroke="{a}" stroke-width="8" stroke-opacity="0.55"/>' for i in range(5))
        return f'<rect x="{cx-w-30:.0f}" y="{top:.0f}" width="{2*w+60:.0f}" height="40" rx="8" fill="{a}"/><rect x="{cx-w-50:.0f}" y="{bot:.0f}" width="{2*w+100:.0f}" height="48" rx="8" fill="{a}"/><rect x="{cx-w:.0f}" y="{top+r*0.18:.0f}" width="{2*w:.0f}" height="{bot-top-r*0.36:.0f}" fill="none" stroke="{a}" stroke-width="16"/>'+flutes
    if kind=="eye":
        h=r*0.85
        return f'<path d="M {cx} {cy-h:.0f} L {cx+h*0.95:.0f} {cy+h*0.6:.0f} L {cx-h*0.95:.0f} {cy+h*0.6:.0f} Z" fill="none" stroke="{a}" stroke-width="18"/><path d="M {cx-r*0.55:.0f} {cy+r*0.2:.0f} Q {cx} {cy-r*0.25:.0f} {cx+r*0.55:.0f} {cy+r*0.2:.0f} Q {cx} {cy+r*0.55:.0f} {cx-r*0.55:.0f} {cy+r*0.2:.0f} Z" fill="none" stroke="{a}" stroke-width="16"/><circle cx="{cx}" cy="{cy+r*0.2:.0f}" r="{r*0.16:.0f}" fill="{a}"/>'
    if kind=="star":
        pts=[]
        for i in range(10):
            rr=r*0.8 if i%2==0 else r*0.34
            ang=math.radians(i*36-90); pts.append(f'{cx+math.cos(ang)*rr:.0f},{cy+math.sin(ang)*rr:.0f}')
        return f'<polygon points="{" ".join(pts)}" fill="{a}" fill-opacity="0.18"/><polygon points="{" ".join(pts)}" fill="none" stroke="{a}" stroke-width="20" stroke-linejoin="round"/>'
    if kind=="target":
        rings="".join(f'<circle cx="{cx}" cy="{cy}" r="{r*0.8-i*r*0.24:.0f}" fill="none" stroke="{a}" stroke-width="18" stroke-opacity="{0.5+0.16*i:.2f}"/>' for i in range(3))
        return rings+f'<circle cx="{cx}" cy="{cy}" r="{r*0.08:.0f}" fill="{a}"/><line x1="{cx-r*0.95:.0f}" y1="{cy}" x2="{cx-r*0.6:.0f}" y2="{cy}" stroke="{a}" stroke-width="14"/><line x1="{cx+r*0.6:.0f}" y1="{cy}" x2="{cx+r*0.95:.0f}" y2="{cy}" stroke="{a}" stroke-width="14"/><line x1="{cx}" y1="{cy-r*0.95:.0f}" x2="{cx}" y2="{cy-r*0.6:.0f}" stroke="{a}" stroke-width="14"/><line x1="{cx}" y1="{cy+r*0.6:.0f}" x2="{cx}" y2="{cy+r*0.95:.0f}" stroke="{a}" stroke-width="14"/>'
    if kind=="book":
        return f'<path d="M {cx} {cy-r*0.55:.0f} C {cx-r*0.3:.0f} {cy-r*0.75:.0f} {cx-r*0.7:.0f} {cy-r*0.6:.0f} {cx-r*0.8:.0f} {cy-r*0.5:.0f} L {cx-r*0.8:.0f} {cy+r*0.6:.0f} C {cx-r*0.7:.0f} {cy+r*0.5:.0f} {cx-r*0.3:.0f} {cy+r*0.4:.0f} {cx} {cy+r*0.55:.0f}" fill="none" stroke="{a}" stroke-width="18" stroke-linejoin="round"/><path d="M {cx} {cy-r*0.55:.0f} C {cx+r*0.3:.0f} {cy-r*0.75:.0f} {cx+r*0.7:.0f} {cy-r*0.6:.0f} {cx+r*0.8:.0f} {cy-r*0.5:.0f} L {cx+r*0.8:.0f} {cy+r*0.6:.0f} C {cx+r*0.7:.0f} {cy+r*0.5:.0f} {cx+r*0.3:.0f} {cy+r*0.4:.0f} {cx} {cy+r*0.55:.0f}" fill="none" stroke="{a}" stroke-width="18" stroke-linejoin="round"/><line x1="{cx}" y1="{cy-r*0.5:.0f}" x2="{cx}" y2="{cy+r*0.55:.0f}" stroke="{a}" stroke-width="14"/>'
    if kind=="trophy":
        return f'<path d="M {cx-r*0.45:.0f} {cy-r*0.6:.0f} L {cx+r*0.45:.0f} {cy-r*0.6:.0f} L {cx+r*0.4:.0f} {cy:.0f} Q {cx+r*0.4:.0f} {cy+r*0.28:.0f} {cx} {cy+r*0.3:.0f} Q {cx-r*0.4:.0f} {cy+r*0.28:.0f} {cx-r*0.4:.0f} {cy:.0f} Z" fill="none" stroke="{a}" stroke-width="20" stroke-linejoin="round"/><path d="M {cx-r*0.45:.0f} {cy-r*0.45:.0f} Q {cx-r*0.85:.0f} {cy-r*0.4:.0f} {cx-r*0.5:.0f} {cy-r*0.05:.0f}" fill="none" stroke="{a}" stroke-width="16"/><path d="M {cx+r*0.45:.0f} {cy-r*0.45:.0f} Q {cx+r*0.85:.0f} {cy-r*0.4:.0f} {cx+r*0.5:.0f} {cy-r*0.05:.0f}" fill="none" stroke="{a}" stroke-width="16"/><line x1="{cx}" y1="{cy+r*0.3:.0f}" x2="{cx}" y2="{cy+r*0.55:.0f}" stroke="{a}" stroke-width="20"/><rect x="{cx-r*0.3:.0f}" y="{cy+r*0.55:.0f}" width="{r*0.6:.0f}" height="34" rx="8" fill="{a}"/>'
    if kind=="chip":
        pins=""
        for i in range(4):
            o=-r*0.45+i*r*0.3
            pins+=f'<line x1="{cx+o:.0f}" y1="{cy-r*0.85:.0f}" x2="{cx+o:.0f}" y2="{cy-r*0.6:.0f}" stroke="{a}" stroke-width="14"/><line x1="{cx+o:.0f}" y1="{cy+r*0.6:.0f}" x2="{cx+o:.0f}" y2="{cy+r*0.85:.0f}" stroke="{a}" stroke-width="14"/><line x1="{cx-r*0.85:.0f}" y1="{cy+o:.0f}" x2="{cx-r*0.6:.0f}" y2="{cy+o:.0f}" stroke="{a}" stroke-width="14"/><line x1="{cx+r*0.6:.0f}" y1="{cy+o:.0f}" x2="{cx+r*0.85:.0f}" y2="{cy+o:.0f}" stroke="{a}" stroke-width="14"/>'
        return f'<rect x="{cx-r*0.6:.0f}" y="{cy-r*0.6:.0f}" width="{r*1.2:.0f}" height="{r*1.2:.0f}" rx="22" fill="none" stroke="{a}" stroke-width="20"/><rect x="{cx-r*0.28:.0f}" y="{cy-r*0.28:.0f}" width="{r*0.56:.0f}" height="{r*0.56:.0f}" rx="10" fill="none" stroke="{a}" stroke-width="14"/>'+pins
    if kind=="rocket":
        return f'<path d="M {cx} {cy-r*0.8:.0f} C {cx+r*0.4:.0f} {cy-r*0.4:.0f} {cx+r*0.4:.0f} {cy+r*0.2:.0f} {cx+r*0.22:.0f} {cy+r*0.45:.0f} L {cx-r*0.22:.0f} {cy+r*0.45:.0f} C {cx-r*0.4:.0f} {cy+r*0.2:.0f} {cx-r*0.4:.0f} {cy-r*0.4:.0f} {cx} {cy-r*0.8:.0f} Z" fill="none" stroke="{a}" stroke-width="20" stroke-linejoin="round"/><circle cx="{cx}" cy="{cy-r*0.2:.0f}" r="{r*0.14:.0f}" fill="none" stroke="{a}" stroke-width="14"/><path d="M {cx-r*0.22:.0f} {cy+r*0.2:.0f} L {cx-r*0.5:.0f} {cy+r*0.5:.0f} L {cx-r*0.22:.0f} {cy+r*0.45:.0f}" fill="none" stroke="{a}" stroke-width="16" stroke-linejoin="round"/><path d="M {cx+r*0.22:.0f} {cy+r*0.2:.0f} L {cx+r*0.5:.0f} {cy+r*0.5:.0f} L {cx+r*0.22:.0f} {cy+r*0.45:.0f}" fill="none" stroke="{a}" stroke-width="16" stroke-linejoin="round"/><path d="M {cx-r*0.12:.0f} {cy+r*0.5:.0f} L {cx} {cy+r*0.82:.0f} L {cx+r*0.12:.0f} {cy+r*0.5:.0f}" fill="{a2}"/>'
    if kind=="lotus":
        petals=""
        for off,ctrl in [(-0.62,-0.5),(-0.32,-0.66),(0,-0.72),(0.32,-0.66),(0.62,-0.5)]:
            ex=cx+r*ctrl if off<0 else cx-r*ctrl if off>0 else cx
            tipx=cx+r*off
            petals+=f'<path d="M {cx} {cy+r*0.42:.0f} Q {cx+r*off*1.3:.0f} {cy+r*ctrl:.0f} {tipx:.0f} {cy-r*0.62:.0f} Q {cx-r*off*1.3:.0f} {cy+r*ctrl:.0f} {cx} {cy+r*0.42:.0f} Z" fill="none" stroke="{a}" stroke-width="14"/>'
        return petals+f'<path d="M {cx-r*0.75:.0f} {cy+r*0.42:.0f} Q {cx} {cy+r*0.85:.0f} {cx+r*0.75:.0f} {cy+r*0.42:.0f}" fill="none" stroke="{a2}" stroke-width="14"/>'
    if kind=="fork":
        return f'<line x1="{cx-r*0.4:.0f}" y1="{cy-r*0.7:.0f}" x2="{cx-r*0.4:.0f}" y2="{cy+r*0.75:.0f}" stroke="{a}" stroke-width="20" stroke-linecap="round"/><path d="M {cx-r*0.62:.0f} {cy-r*0.7:.0f} L {cx-r*0.62:.0f} {cy-r*0.3:.0f} Q {cx-r*0.62:.0f} {cy-r*0.1:.0f} {cx-r*0.4:.0f} {cy-r*0.1:.0f} Q {cx-r*0.18:.0f} {cy-r*0.1:.0f} {cx-r*0.18:.0f} {cy-r*0.3:.0f} L {cx-r*0.18:.0f} {cy-r*0.7:.0f}" fill="none" stroke="{a}" stroke-width="16"/><path d="M {cx+r*0.4:.0f} {cy-r*0.7:.0f} Q {cx+r*0.15:.0f} {cy-r*0.6:.0f} {cx+r*0.2:.0f} {cy-r*0.15:.0f} Q {cx+r*0.22:.0f} {cy+r*0.05:.0f} {cx+r*0.4:.0f} {cy+r*0.05:.0f}" fill="none" stroke="{a}" stroke-width="16"/><line x1="{cx+r*0.4:.0f}" y1="{cy+r*0.05:.0f}" x2="{cx+r*0.4:.0f}" y2="{cy+r*0.75:.0f}" stroke="{a}" stroke-width="20" stroke-linecap="round"/>'
    if kind=="compass":
        ticks=""
        for i in range(12):
            ang=math.radians(i*30); x1=cx+math.cos(ang)*r*0.72; y1=cy+math.sin(ang)*r*0.72; x2=cx+math.cos(ang)*r*0.8; y2=cy+math.sin(ang)*r*0.8
            ticks+=f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{a}" stroke-width="10" stroke-opacity="0.6"/>'
        return f'<circle cx="{cx}" cy="{cy}" r="{r*0.8:.0f}" fill="none" stroke="{a}" stroke-width="20"/>'+ticks+f'<path d="M {cx} {cy-r*0.5:.0f} L {cx+r*0.18:.0f} {cy:.0f} L {cx} {cy+r*0.5:.0f} L {cx-r*0.18:.0f} {cy:.0f} Z" fill="{a}"/><path d="M {cx} {cy-r*0.5:.0f} L {cx+r*0.18:.0f} {cy:.0f} L {cx-r*0.18:.0f} {cy:.0f} Z" fill="{a2}"/><circle cx="{cx}" cy="{cy}" r="{r*0.06:.0f}" fill="{a2}"/>'
    return ""

def make(num, sh):
    title_lines=sh["title"]; ts = 250 if len(title_lines)>1 else 300
    cx=S/2
    title_y0 = S*0.595
    tspans=""
    for i,ln in enumerate(title_lines):
        col = "#ffffff" if i==0 else "url(#acc)"
        tspans+=f'<text x="{cx}" y="{title_y0+i*ts*1.02:.0f}" fill="{col}" font-family="DejaVu Sans" font-weight="bold" font-size="{ts}" letter-spacing="-6" text-anchor="middle">{html.escape(ln)}</text>'
    n_lines=len(title_lines)
    rule_y=title_y0+n_lines*ts*1.02+30
    tag_y=title_y0+n_lines*ts*1.02+175
    gcx, gcy, gr = cx, S*0.295, S*0.155
    svg=f'''<svg width="{S}" height="{S}" viewBox="0 0 {S} {S}" xmlns="http://www.w3.org/2000/svg">
 <defs>
  <radialGradient id="bg" cx="50%" cy="32%" r="82%">
   <stop offset="0%" stop-color="{sh['c2']}"/><stop offset="100%" stop-color="{sh['c1']}"/>
  </radialGradient>
  <radialGradient id="glow" cx="50%" cy="29%" r="52%">
   <stop offset="0%" stop-color="{sh['accent']}" stop-opacity="0.38"/>
   <stop offset="62%" stop-color="{sh['accent']}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0%" stop-color="{sh['accent']}"/><stop offset="100%" stop-color="{sh['accent2']}"/>
  </linearGradient>
 </defs>
 <rect width="{S}" height="{S}" fill="url(#bg)"/>
 <rect width="{S}" height="{S}" fill="url(#glow)"/>
 <rect x="70" y="70" width="{S-140}" height="{S-140}" rx="60" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="4"/>
 {glyph_svg(sh['glyph'], gcx, gcy, gr, sh['accent'], sh['accent2'])}
 <text x="{cx}" y="{S*0.495:.0f}" fill="{sh['accent']}" font-family="DejaVu Sans Mono" font-size="58" letter-spacing="22" text-anchor="middle">{html.escape(sh['cat'])}</text>
 {tspans}
 <rect x="{cx-130:.0f}" y="{rule_y:.0f}" width="260" height="10" rx="5" fill="url(#acc)"/>
 <text x="{cx}" y="{tag_y:.0f}" fill="#d9d4de" font-family="DejaVu Sans" font-size="72" text-anchor="middle">{html.escape(sh['tag'])}</text>
 <text x="{cx}" y="{S-185:.0f}" fill="#8a8694" font-family="DejaVu Sans Mono" font-size="46" letter-spacing="16" text-anchor="middle">STARLIGHTMIX AUDIO</text>
 <text x="{cx}" y="{S-112:.0f}" fill="#5f5b69" font-family="DejaVu Sans Mono" font-size="38" letter-spacing="10" text-anchor="middle">studio.starlightmix.com</text>
 <circle cx="205" cy="205" r="94" fill="url(#acc)"/>
 <text x="205" y="234" fill="#10060a" font-family="DejaVu Sans" font-weight="bold" font-size="86" text-anchor="middle">{num}</text>
</svg>'''
    out=os.path.join(OUT, f"{num}-{sh['slug']}.png")
    cairosvg.svg2png(bytestring=svg.encode(), write_to=out, output_width=S, output_height=S)
    return out

if __name__=="__main__":
    import sys
    only=sys.argv[1] if len(sys.argv)>1 else None
    for num,sh in SHOWS.items():
        if only and num!=only: continue
        print("rendered", make(num,sh))
