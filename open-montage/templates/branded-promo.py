#!/usr/bin/env python3
"""branded-promo — generate on-brand gradient scene frames + a music bed for a promo,
then hand them to open-montage/montage.py. Edit SCENES / PALETTE and re-run.

  python3 open-montage/templates/branded-promo.py            # writes frames+bed+manifest to ./promo-out
  python3 open-montage/montage.py --manifest promo-out/montage.json -o promo.mp4
"""
import math, os, wave, struct, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = "promo-out"; os.makedirs(OUT, exist_ok=True)
W, H = 1280, 720

# --- Brand palette (MindBlow Media) — swap for yours ---
INK=(10,12,18); SPARK=(200,255,67); COBALT=(91,124,255); CYAN=(53,224,214); CORAL=(255,92,73); PAPER=(244,246,238)

# --- The film: (kicker, big line, accent word, accent colour, glow colour, caption, seconds) ---
SCENES = [
    ("Munich · Bangkok", "MINDBLOW",              "BLOW",      SPARK,  COBALT, "",                                   3.2),
    ("what we do",       "We design apps",        "design",    CYAN,   CYAN,   "Landing pages, dashboards, PWAs",    3.0),
    ("what we do",       "We build sites",        "build",     SPARK,  CORAL,  "Self-contained, ships to Pages/Vercel",3.0),
    ("what we do",       "We automate it all",    "automate",  COBALT, COBALT, "Agents, pipelines, end-to-end",      3.0),
    ("the model",        "One builder. Full stack.","Full stack.",SPARK,SPARK, "Move faster than a team of twenty",  3.0),
    ("",                 "Let's make something.", "make",      SPARK,  CYAN,   "",                                   3.2),
]

def font(sz):
    try: return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", sz)
    except OSError: return ImageFont.load_default()

def grad(c2):
    base=Image.new("RGB",(W,H),INK); top=Image.new("RGB",(W,H),c2); m=Image.new("L",(W,H)); md=m.load()
    for y in range(H):
        v=int(255*(y/H)**1.3)
        for x in range(W): md[x,y]=v
    return Image.composite(top,base,m)

def glow(im,col):
    ov=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(ov).ellipse([W//2-420,int(H*0.72)-420,W//2+420,int(H*0.72)+420],fill=col+(80,))
    return Image.alpha_composite(im.convert("RGBA"),ov.filter(ImageFilter.GaussianBlur(70))).convert("RGB")

def render_scene(i, kicker, big, accent, acol, gcol, fn):
    im=glow(grad(tuple(min(255,int(c*0.4+INK[j]*0.6)) for j,c in enumerate(gcol))), gcol); d=ImageDraw.Draw(im)
    if kicker:
        fk=font(26); t=" ".join(kicker.upper()); w=d.textbbox((0,0),t,font=fk)[2]; d.text(((W-w)//2,90),t,font=fk,fill=acol)
    fb=font(96); y=int(H*0.40)
    if accent and accent in big:
        pre,post=big.split(accent,1); wtot=d.textbbox((0,0),big,font=fb)[2]; x=(W-wtot)//2
        d.text((x,y),pre,font=fb,fill=PAPER); x+=d.textbbox((0,0),pre,font=fb)[2]
        d.text((x,y),accent,font=fb,fill=acol); x+=d.textbbox((0,0),accent,font=fb)[2]
        d.text((x,y),post,font=fb,fill=PAPER)
    else:
        w=d.textbbox((0,0),big,font=fb)[2]; d.text(((W-w)//2,y),big,font=fb,fill=PAPER)
    d.rounded_rectangle([W//2-70,y+120,W//2+70,y+130],5,fill=acol)
    im.save(fn)

def music(path, dur):
    sr=44100; prog=[(196,247,294),(220,277,330),(174,220,262),(233,294,349),(196,247,294)]
    with wave.open(path,"w") as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(sr)
        for i in range(int(sr*dur)):
            t=i/sr; ch=prog[min(len(prog)-1,int(t/4))]; arp=ch[int(t*4)%3]
            a=0.13*math.sin(2*math.pi*ch[0]*t)+0.10*math.sin(2*math.pi*ch[1]*t)+0.06*math.sin(2*math.pi*arp*2*t)+0.03*math.sin(2*math.pi*ch[0]/2*t)
            env=min(1,t/1.5)*min(1,(dur-t)/2.5)
            wv.writeframesraw(struct.pack("<h",int(max(-1,min(1,a))*env*32767)))

shots=[]
for i,(k,big,acc,acol,gcol,cap,secs) in enumerate(SCENES):
    fn=f"{OUT}/scene{i:02d}.png"; render_scene(i,k,big,acc,acol,gcol,fn)
    s={"src":os.path.basename(fn),"duration":secs}
    if cap: s["caption"]=cap
    shots.append(s)
total=sum(s["duration"] for s in shots)
music(f"{OUT}/bed.wav", total)
json.dump({"music":"bed.wav","size":[W,H],"fps":24,"fade":0.5,"shots":shots}, open(f"{OUT}/montage.json","w"), indent=2)
print(f"✓ {len(shots)} scenes + bed → {OUT}/  (run: python3 open-montage/montage.py --manifest {OUT}/montage.json -o promo.mp4)")
