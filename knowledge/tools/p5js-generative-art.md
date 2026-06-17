# p5.js Generative Art: Structure & Best Practices

Best practices guide for building parameterized, reproducible, performant generative art in p5.js. Focuses on code structure and principles, not prescribing what art to create. Emphasizes seeded randomness for Art Blocks-style reproducibility and parameter-driven exploration.

Official: `p5.js` · Reference: https://p5js.org/

## Why This Matters for Creative Workflows

Generative art sits at the intersection of algorithm and aesthetics. Clean code structure lets you:

1. **Iterate rapidly** — Change parameters, see results instantly
2. **Reproduce outputs** — Seeded randomness = "save this art variant"
3. **Export assets** — Generate frames for RHYTHMIX video pipelines
4. **Collaborate** — Others understand and extend your code
5. **Scale outputs** — Batch-generate variations (e.g., 1000 unique pieces)

## Nine Core Principles

### 1. Parameter Organization

Keep ALL tunable values in a single `params` object.

```javascript
let params = {
    seed: 12345,
    colorPalette: ['#d97757', '#6a9bcc', '#788c5d', '#b0aea5'],
    particleCount: 500,
    speed: 2.5,
    rotationAngle: 0.05,
    // Add parameters that match YOUR algorithm
};
```

**Why**: 
- Easy to wire to UI controls (sliders, color pickers)
- Can serialize/save configurations as JSON
- Reset to defaults with a single copy
- Reproducibility when you save `params`

### 2. Seeded Randomness (Critical)

ALWAYS initialize randomness with a seed at startup.

```javascript
function initializeSeed(seed) {
    randomSeed(seed);
    noiseSeed(seed);
    // Now all random() and noise() calls are deterministic
}

function setup() {
    createCanvas(800, 800);
    initializeSeed(params.seed);
    // ... rest of setup
}
```

**Why**:
- Same seed = same output every time (reproducibility)
- Enables "sharing" art variants by seed number
- Art Blocks standard — required for on-chain art
- Essential for batch generation pipelines

**Common mistake**: Calling `randomSeed()` inside `draw()` — resets every frame!

### 3. P5.js Lifecycle Patterns

Three approaches, pick based on your art:

| Pattern | Use Case | Setup | Draw |
|---|---|---|---|
| **Static** | Single-frame composition | Generate everything | Empty or `noLoop()` |
| **Animated** | Continuous evolution, looping | Initialize objects | Update + render each frame |
| **Interactive** | User-triggered regeneration | Initial state | Respond to input, `redraw()` on change |

**Static example** (runs once, then stops):
```javascript
function setup() {
    createCanvas(800, 800);
    initializeSeed(params.seed);
    generateComposition();
    noLoop(); // Don't keep drawing
}

function draw() {
    // Empty or minimal — setup() already drew everything
}
```

**Animated example** (continuous, 60fps):
```javascript
let particles = [];

function setup() {
    createCanvas(800, 800);
    initializeSeed(params.seed);
    particles = generateParticles(params.particleCount);
}

function draw() {
    background(250, 249, 245);
    
    for (let p of particles) {
        p.update();
        p.display();
    }
}
```

**Interactive example** (no redraw until you say so):
```javascript
function setup() {
    createCanvas(800, 800);
    noLoop();
    regenerate();
}

function keyPressed() {
    if (key === 'r') {
        params.seed = int(random(1000000));
        regenerate();
    }
}

function regenerate() {
    initializeSeed(params.seed);
    // Re-generate from scratch
    redraw();
}
```

### 4. Class Structure for Complex Objects

Use classes when your art involves multiple entities (particles, agents, cells, nodes).

```javascript
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);
        this.color = params.colorPalette[int(random(params.colorPalette.length))];
        this.age = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        
        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
    }

    display() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, 4);
    }

    isAlive() {
        return this.age < 1000;
    }
}
```

**Key principles**:
- **Separate update from display** — easier to reason about
- **Initialize in constructor using seeded random** — reproducible
- **Keep state minimal** — only store what you need

### 5. Performance Considerations

Generative art can get slow. Monitor and optimize:

| Bottleneck | Mitigation |
|---|---|
| **Too many particles** | Reduce count, use simpler shapes, profile frame rate |
| **Expensive calculations** | Pre-calculate, use lookup tables, avoid sqrt/trig in hot loops |
| **Collision detection** | Spatial hashing (divide canvas into grid cells), limit neighbor checks |
| **Memory** | Don't store history unless needed, clear old objects |

**Quick profiling**:
```javascript
function draw() {
    let t0 = performance.now();
    
    // ... your draw code
    
    let t1 = performance.now();
    fill(0);
    text(`${(t1 - t0).toFixed(1)}ms`, 10, 20);
}
```

Aim for ~16ms per frame (60fps). If slower, optimize or reduce complexity.

### 6. Utility Functions

Common helpers that make generative art cleaner:

```javascript
// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorFromPalette(index) {
    return params.colorPalette[index % params.colorPalette.length];
}

// Mapping ranges
function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

// Easing (smooth motion)
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Edge wrapping
function wrapAround(value, max) {
    return ((value % max) + max) % max;
}

// Noise-driven variation (organic feel)
function getNoiseValue(x, y, scale = 0.01) {
    return noise(x * scale, y * scale);
}

// Vectors from angles
function vectorFromAngle(angle, magnitude = 1) {
    return createVector(cos(angle) * magnitude, sin(angle) * magnitude);
}

// Fade effect (trails/time decay)
function fadeBackground(opacity) {
    fill(250, 249, 245, opacity);
    noStroke();
    rect(0, 0, width, height);
}
```

### 7. Parameter Updates & UI Integration

Wire parameters to UI controls for real-time exploration:

```javascript
// HTML: <input type="range" min="0" max="1000" id="seedSlider">

document.getElementById('seedSlider').addEventListener('input', (e) => {
    updateParameter('seed', int(e.target.value));
});

function updateParameter(paramName, value) {
    params[paramName] = value;
    
    // Decide: does this need full regeneration or can it update live?
    if (['seed', 'particleCount'].includes(paramName)) {
        regenerate(); // Full restart
    } else {
        // Some params can update in real-time without regeneration
    }
}

function regenerate() {
    initializeSeed(params.seed);
    // Re-initialize all entities
}
```

### 8. Common p5.js Patterns

**Trail/fade effect** (continuous motion with ghosts):
```javascript
function draw() {
    fadeBackground(10); // Partial transparency = motion trails
    
    // Draw particles on top
    for (let p of particles) {
        p.update();
        p.display();
    }
}
```

**Noise-driven movement** (organic, wandering):
```javascript
class WanderingAgent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.t = random(1000); // Time for noise
    }

    update() {
        // Use noise to steer smoothly
        this.angle += getNoiseValue(this.t, 0) * 0.1;
        
        let v = vectorFromAngle(this.angle, params.speed);
        this.x += v.x;
        this.y += v.y;
        
        this.t += 0.01;
    }
}
```

**Grid-based generation** (structured composition):
```javascript
function generateGrid(cols, rows, cellWidth, cellHeight) {
    let elements = [];
    
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            let x = c * cellWidth + cellWidth / 2;
            let y = r * cellHeight + cellHeight / 2;
            
            // Vary within cell based on seed
            let variation = getNoiseValue(c, r);
            
            elements.push({
                x: x + variation * cellWidth * 0.1,
                y: y + variation * cellHeight * 0.1,
                size: mapRange(variation, 0, 1, 10, 50),
                color: colorFromPalette(c + r),
            });
        }
    }
    
    return elements;
}
```

### 9. Export Functions

Save outputs for use in other pipelines (e.g., RHYTHMIX video frames):

```javascript
function exportImage() {
    // Save as PNG with seed in filename for traceability
    saveCanvas(`generative-art-${params.seed}`, 'png');
}

// For batch generation
function batchExport(count) {
    for (let i = 0; i < count; i++) {
        params.seed = int(random(1000000));
        regenerate();
        exportImage();
        // pause(500); // Optional: small delay between saves
    }
}
```

## Fit & Caveats

- **p5.js is browser-based** — not ideal for real-time 3D or very large datasets
- **Performance on mobile** — can be slow on older devices; test early
- **Canvas size matters** — larger = more pixels, more computation
- **Seeded random is deterministic but not cryptographic** — use `randomSeed()` for art, not security
- **Export is PNG only** — for SVG, use `createGraphics()` and a separate SVG library

## Ecosystem Integration Patterns

### Pattern 1: RHYTHMIX Visual Frames

Generate unique frames for promo videos:

```javascript
// Each seed = unique visual frame
function generateVideoFrame(seed, duration) {
    params.seed = seed;
    regenerate();
    
    // Render frame
    let frame = get();
    
    // Export for video pipeline
    saveCanvas(`frame-${seed}`, 'png');
}

// Batch-generate 30 unique frames for a 30-second video
for (let i = 0; i < 30; i++) {
    generateVideoFrame(int(random(1000000)), 1);
}
```

Then composite in HyperFrames or SkyReels.

### Pattern 2: Procedural Asset Generation

Generate backgrounds, patterns, textures for design:

```javascript
// Generate a unique color palette based on seed
function generatePalette(seed, count) {
    randomSeed(seed);
    let palette = [];
    
    for (let i = 0; i < count; i++) {
        let h = random(360);
        let s = random(30, 100);
        let b = random(50, 100);
        
        colorMode(HSB);
        palette.push(color(h, s, b));
    }
    
    colorMode(RGB);
    return palette;
}

// Use in design system
let brandPalettes = {};
for (let i = 0; i < 100; i++) {
    brandPalettes[i] = generatePalette(i, 5);
}
```

### Pattern 3: Interactive Exploration

p5.js sketch with live parameter tuning:

```html
<div id="sketch"></div>
<div id="controls">
    <label>Seed: <input type="number" id="seedInput"></label>
    <label>Particle Count: <input type="range" min="10" max="1000" id="countSlider"></label>
    <button onclick="exportImage()">Export</button>
</div>
```

User adjusts parameters in real-time, sees results, exports favorites.

## References

- **p5.js**: https://p5js.org/ (official docs, examples, community)
- **Nature of Code (Daniel Shiffman)**: https://nature.p5js.org/ (algorithms for generative art)
- **Art Blocks**: https://www.artblocks.io/ (on-chain generative art platform, uses seeded random standard)
- **Creative Coding**: https://www.youtube.com/@thecodingtrain (Shiffman's tutorials)

---

**Use Case for Ecosystem:** Structured approach to building parameterized, reproducible generative art in p5.js. Seeded randomness for Art Blocks-style reproducibility and batch generation. Applicable to RHYTHMIX visual frame generation, procedural texture/background generation for design systems, and interactive asset exploration. Parameter-driven so outputs can be controlled via UI or programmatically for pipeline integration.
