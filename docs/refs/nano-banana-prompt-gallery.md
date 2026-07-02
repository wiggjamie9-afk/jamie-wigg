# Image-Gen Prompt Gallery — Reusable Templates

Curated from the **OpenNana "Awesome Prompt Gallery"** (cases 601–700), mostly for
**Nano Banana Pro** (also Grok / Z-Image). Full live gallery (all ~100 cases, with
example images and the many portrait/selfie variants not repeated here):

**https://opennana.com/awesome-prompt-gallery/**

> This file keeps the **reusable, template-style** prompts — the ones with
> `[PLACEHOLDER]` slots or broadly-applicable structures. The gallery's large set of
> one-off portrait/selfie prompts is not duplicated here; grab those from the link above.
> Handy for RHYTHMIX cover art, promo stills, explainer visuals, and city/venue pieces.

---

## Miniature / diorama / 3D city

**Isometric miniature city with live weather (#668)**
```
Present a clear, 45° top-down isometric miniature 3D cartoon scene of [CITY], featuring its most iconic landmarks and architectural elements. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows. Integrate the current weather conditions directly into the city environment to create an immersive atmospheric mood. Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the title "[CITY]" in large bold text, a prominent weather icon beneath it, then the date (small text) and temperature (medium text). All text must be centered with consistent spacing, and may subtly overlap the tops of the buildings. Square 1080x1080 dimension.
```

**Three tallest buildings, strict proportional heights (#682)**
```
Present a clear, side miniature 3D cartoon view of [YOUR CITY] tallest buildings. Use minimal textures with realistic materials and soft, lifelike lighting and shadows. Show exactly the three tallest buildings, arranged LEFT to RIGHT in STRICT descending height order, with accurate relative proportions. Each building stands separately on a thin ceramic base. Below each base, centered text: Height in meters (semibold sans-serif) and Year built (lighter, smaller, beneath). Write "YOUR CITY NAME" centered above. Straight-on orthographic-style rendering, no forced perspective. Square 1080×1080, clean neutral background.
```

**City landmarks built into a cake (#662)** — 45° isometric micro-city sitting on a round cream cake; hero landmark `[核心地标]` largest in center, 3–5 other landmarks `[建筑列表]` around it; weather `[天气类型]` expressed as dessert (snow=icing, rain=syrup/sugar pearls, sun=melting cream); title + weather icon + date + temp centered on top. 1080×1080.

**Architectural evolution diorama (#700)** — circular floating platform split into 4 quadrants (historic → colonial → modern → future), every building a tangible 3D miniature model, tilt-shift, bilingual title. (Adapt `[CITY]` + eras.)

---

## Technical / exploded / knolling

**3D exploded assembly hologram (#647)** — person at a workbench viewing a floating, fully-rendered rotating exploded diagram of `[DEVICE]`; bright yellow/orange vector callout lines with part numbers; shallow DoF, 16:9.

**Technical illustration, exploded components (#614)**
```
Create a detailed technical illustration of a [SUBJECT], exploded into components: [part 1], [part 2], [part 3]. Each part labeled with a clean futuristic font. Use a graphite and crimson color scheme on a dark blueprint background. Add subtle particle glow and depth shadows. Studio render style.
```

**Product teardown + knolling (#627)** — split composition: left 1/3 the intact product, right 2/3 the internals laid out in a neat knolling grid; pure white background, commercial product photography. (Swap MacBook Pro for any `[PRODUCT]`.)

**Knolling (#655)** — `A knolling for [SUBJECT]` (neatly arranged flat-lay of related objects).

**Collectible chess piece (#644)**
```
A hyper-detailed 3D render of a collectible chess piece designed as [ICON]. Sculpted in polished marble with gold accents, stylized classic chess-piece base. The character's iconic features/clothing/accessories captured in a simplified but instantly recognizable form. Studio lighting, soft reflections, dramatic shadows, photorealistic textures. Clean neutral background, 1080x1080.
```

---

## Grids & multi-shot

**3×3 editorial studio grid (#685 / #695 / #640 / #607 / #673)** — 9-frame contact sheet, face 100% consistent with uploaded image, vary lighting/angle/crop within a set look. Core template:
```
Editorial 3x3 grid in a [BACKDROP] studio. Character (face characteristics 100% same as uploaded image) wearing [OUTFIT]. Lighting: [SETUP]. Nine shots: cheek/lip macro with blurred hand, reflective eye crop, B&W chin-rest portrait, fabric-framed over-shoulder, frontal light-band close-up, angled hair-fall portrait, hand-to-collarbone crop, seated half-body, profile droplet highlight. RAW, airy tones, smooth editorial finish.
```
(For beauty e-commerce: `3×3 storyboard contact sheet` of `{{product_main}}` + `{{product_secondary}}` on `{{background}}` / `{{lighting}}`.)

**One image → 9 cinematic shot sizes (#629)** — analyze an uploaded image, output a coherent 3×3 "contact sheet": ELS, LS, medium-long, MS, MCU, CU, ECU, low-angle, high-angle — same subject/wardrobe/lighting across all 9, realistic DoF variation.

**One face, six emotions (#645)** — 6-panel (3×2) polished 3D caricature, consistent identity, emotions: happy / surprised / serious / cute / sassy / confident; bold distinct backgrounds per panel.

**9 professional lighting setups (#607)** — 3×3 grid demonstrating nine lighting styles on the same face.

---

## Materials & illustration styles

**Felt toy (#697)**
```
Full body [SUBJECT] toy, [ATTRIBUTES/ACCESSORIES], [EXPRESSION], made of felt, in a [PLACE], [LIGHTING], friendly and cartoonish appearance, rich and soft textures.
```

**3D pop-up book (#636)**
```
A 3D pop-up book illustration featuring a [SUBJECT], with layered paper elements unfolding into a miniature scene. Soft lighting, textured paper surfaces, playful handcrafted look, pastel [color1] and [color2] palette, viewed from a slight angle to show depth and detail.
```

**Ink-painting + realism blend (#634)** — combine Chinese ink-wash style with photorealism; e.g. misty mountain teahouse with a couplet on the door (swap the `[对联/text]`).

**Ink minimalism (#626)** — `黑白水墨画风格，留白意境，[主体]，极简线条，宣纸纹理，红色印章点缀，东方哲学感`.

**Hand-drawn watercolor infographic (#624)** — warm pink watercolor educational infographic, cute doctor/illustrator character, title `[主标题]`, N cute figures each pairing a `[症状]` with a `[营养素]` icon. 4:5, 1080×1350.

---

## Travel / advertising

**3D portal travel ad (#653)**
```
A hyper-realistic travel advertisement, square (1080x1080): a hand holding a sleek ultra-thin phone/tablet tilted slightly to create a 3D portal effect. The screen shows an iconic landmark of [COUNTRY] that continues seamlessly into the real background, appearing to emerge from the screen. Birds nearby, a plane crossing a bright blue sky. Bold clean sans-serif "[COUNTRY]" above. Warm natural light, soft shadows, glossy minimal-bezel device.
```

---

## Utility / meta prompts

- **Reverse a picture into a prompt (#681):** `Convert images to JSON requests, including dimensions and detailed information.`
- **Label everything bilingually (#691):** `请画一幅[场景]的插图。用英文/日文标注所有物品。格式：英文（日文）。`
- **Bilingual kids cognition poster (#689 / #690):** panoramic flat-cute-cartoon or claymation diorama; `[SCENE_THEME]`, `[TARGET_AGE]`; each object gets a 3-line label (中文 / 拼音 / English) with clean arrows.
- **Critique my artwork (#623):** `请深入分析并点评这部作品。在图像中用红色文字标注需要修改和做得好的地方。像一流美术大学讲师那样毫无顾忌地点评。`
- **Photorealistic scene at a specific place/time (#687):** describe location + weekday + month/year + weather + one sharp foreground subject + blurred background, "candid iPhone morning-light feel."
- **Aerial image from coordinates (#661):** compose over the sky at `[latitude, longitude]`, subject blended in as if falling into frame; low-res disposable-camera candid look.

---

## Playful / creative concepts

- **Map made of foods (#686):** a map of `[COUNTRY/REGION]` where each province/state is *formed out of* its most famous local dish (looks constructed from food, not photos of food). Double-check each region.
- **Paint an ancient poem (#635 / #631):** give the poem lines, "根据古诗画一幅画，并附上原文."
- **Disaster-movie giant object (#633):** megalophobia / Hollywood-disaster style — a giant `[everyday object]` crashing into a city intersection, with a big warning slogan replacing its branding.
- **Cozy izakaya humor (#632):** warm Japanese izakaya, a `[animal]` chef grilling skewers, lanterns/menu boards with funny slogans.
- **Character teaches a class (#663):** photorealistic room + a beloved animated character `[character]` standing at the front like a teacher, chalkboard content, warm afternoon light — realistic, not a cartoon screenshot.
- **Recursive picture frame (#612):** a person holding a frame containing a photo of themselves holding the same frame, spiraling inward — "strange loop."
- **Mini-self inside the head (#650):** surreal flat illustration, head split at the nose, a tiny version of the same person standing inside lifting the top of the head, cosmic void within.
```
