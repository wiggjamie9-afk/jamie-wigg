// HerdCheck — image heuristics (Canvas-based, in-browser, no model)
// Honest scope: these are coarse colour-and-symmetry indicators that surface
// signal the farmer can corroborate. They are NOT a diagnostic CV model.
// Designed to compose with the structured checklist in scoring.js.

(function() {

  // Load an image from a File/Blob into an Image element
  function fileToImage(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        res({ img, url });
      };
      img.onerror = () => rej(new Error('Image load failed'));
      img.src = url;
    });
  }

  // Draw an image onto a downscaled canvas for fast analysis
  function toCanvas(img, maxDim = 320) {
    const ratio = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
    const w = Math.round(img.naturalWidth * ratio);
    const h = Math.round(img.naturalHeight * ratio);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return c;
  }

  function imageData(canvas, x = 0, y = 0, w, h) {
    return canvas.getContext('2d').getImageData(x, y, w || canvas.width, h || canvas.height);
  }

  // RGB → HSV. Returns hue 0–360, sat 0–1, val 0–1.
  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d > 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return [h, s, v];
  }

  // Mean RGB and red-pixel fraction within an ImageData
  function regionStats(data) {
    let r = 0, g = 0, b = 0, count = 0, redCount = 0, brightCount = 0;
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const rr = px[i], gg = px[i + 1], bb = px[i + 2];
      r += rr; g += gg; b += bb; count++;
      const [h, s, v] = rgbToHsv(rr, gg, bb);
      // "Red-tinged skin": red hue band, decent saturation, mid brightness
      const inRedBand = (h <= 20 || h >= 340);
      if (inRedBand && s > 0.25 && v > 0.25 && v < 0.92) redCount++;
      if (v > 0.5) brightCount++;
    }
    return {
      meanR: r / count,
      meanG: g / count,
      meanB: b / count,
      redFraction: redCount / count,
      brightFraction: brightCount / count,
      count
    };
  }

  // Compare left half vs right half of the image
  function symmetryScore(canvas) {
    const w = canvas.width, h = canvas.height;
    const half = Math.floor(w / 2);
    const left = imageData(canvas, 0, 0, half, h);
    const right = imageData(canvas, w - half, 0, half, h);
    const L = regionStats(left);
    const R = regionStats(right);
    // Normalised difference 0..1
    const dr = Math.abs(L.meanR - R.meanR) / 255;
    const dg = Math.abs(L.meanG - R.meanG) / 255;
    const db = Math.abs(L.meanB - R.meanB) / 255;
    const dRed = Math.abs(L.redFraction - R.redFraction);
    const dBright = Math.abs(L.brightFraction - R.brightFraction);
    // Weighted: colour difference matters less than red-pixel and brightness drift
    const asymmetry = Math.min(1, 0.4 * (dr + dg + db) + 1.2 * dRed + 0.6 * dBright);
    return { asymmetry, leftStats: L, rightStats: R };
  }

  // Public: analyse an udder photo
  async function analyseUdder(file) {
    const { img, url } = await fileToImage(file);
    const canvas = toCanvas(img, 320);
    const full = regionStats(imageData(canvas));
    const sym = symmetryScore(canvas);
    URL.revokeObjectURL(url);
    return {
      asymmetry: sym.asymmetry,           // 0 (matched) → 1 (very different)
      rednessFraction: full.redFraction,  // 0 → 1
      brightness: full.brightFraction,    // exposure sanity
      imageBlob: file
    };
  }

  // Public: extract a single frame from a video file for thumbnailing
  async function videoThumbnail(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const v = document.createElement('video');
      v.src = url;
      v.muted = true;
      v.playsInline = true;
      v.crossOrigin = 'anonymous';
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        // Seek to a representative frame
        v.currentTime = Math.min(0.5, (v.duration || 1) / 3);
      };
      v.onseeked = () => {
        const c = document.createElement('canvas');
        const ratio = Math.min(320 / v.videoWidth, 320 / v.videoHeight, 1);
        c.width = Math.round(v.videoWidth * ratio);
        c.height = Math.round(v.videoHeight * ratio);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve({ thumbnail: blob, duration: v.duration });
        }, 'image/jpeg', 0.7);
      };
      v.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Video load failed')); };
    });
  }

  // Public: store a blob as a base64 data URL (so it can live in IndexedDB easily)
  function blobToDataUrl(blob) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(blob);
    });
  }

  window.HC = window.HC || {};
  window.HC.vision = {
    analyseUdder,
    videoThumbnail,
    blobToDataUrl
  };
})();
