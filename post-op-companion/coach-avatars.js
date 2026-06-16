// AI Coach Avatars — generates warm, friendly coach faces on-device via Replicate (FLUX 1.1 Pro).
// Falls back to a styled Stitch Vibe gradient avatar when no token / offline / CORS-blocked.
// Generation runs at runtime on the user's device using their own Replicate token — nothing server-side.
class CoachAvatars {
  constructor(app) {
    this.app = app;
    this.token = localStorage.getItem('replicate-api-token') || '';
    this.cache = JSON.parse(localStorage.getItem('coach-avatar-cache') || '{}');

    // Four coach personas, each tied to a tab section. Prompts lock to the Stitch Vibe palette.
    this.coaches = {
      meals: {
        name: 'Maya',
        role: 'Nutrition Coach',
        emoji: '🥗',
        gradient: 'linear-gradient(135deg, #FFE4E1, #FFB6C1)',
        prompt: 'warm friendly female nutrition coach, gentle natural smile, soft pink studio lighting, approachable, modern 2026 wellness aesthetic, soft glassmorphism background, professional headshot portrait, photorealistic, high detail',
      },
      fitness: {
        name: 'Theo',
        role: 'Fitness Coach',
        emoji: '💪',
        gradient: 'linear-gradient(135deg, #FFD8C2, #FFB199)',
        prompt: 'warm encouraging male fitness coach, friendly confident smile, soft warm studio lighting, athletic and approachable, modern 2026 wellness aesthetic, soft glassmorphism background, professional headshot portrait, photorealistic, high detail',
      },
      sleep: {
        name: 'Luna',
        role: 'Sleep Coach',
        emoji: '🌙',
        gradient: 'linear-gradient(135deg, #E0D4F7, #C9B6E4)',
        prompt: 'calm soothing female sleep coach, serene gentle expression, soft lavender studio lighting, peaceful and reassuring, modern 2026 wellness aesthetic, soft glassmorphism background, professional headshot portrait, photorealistic, high detail',
      },
      mental: {
        name: 'Sage',
        role: 'Mental Health Coach',
        emoji: '🧠',
        gradient: 'linear-gradient(135deg, #C2E9FB, #A1C4FD)',
        prompt: 'gentle empathetic mental health coach, kind warm expression, soft calming studio lighting, compassionate and trustworthy, modern 2026 wellness aesthetic, soft glassmorphism background, professional headshot portrait, photorealistic, high detail',
      },
    };

    this.init();
  }

  init() {
    Object.keys(this.coaches).forEach(tab => this.mountAvatar(tab));
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('replicate-api-token', token);
  }

  hasToken() {
    return !!this.token && this.token.startsWith('r8_');
  }

  // Insert an avatar header at the top of a coach section's container.
  mountAvatar(tab) {
    const section = document.getElementById(tab);
    if (!section) return;
    const container = section.firstElementChild || section;
    if (container.querySelector('.coach-avatar-header')) return; // already mounted

    const coach = this.coaches[tab];
    const header = document.createElement('div');
    header.className = 'coach-avatar-header';
    header.innerHTML = `
      <div class="coach-avatar" id="coach-avatar-${tab}" style="background:${coach.gradient}">
        <span class="coach-avatar-fallback">${coach.emoji}</span>
      </div>
      <div class="coach-avatar-meta">
        <span class="coach-name">${coach.name}</span>
        <span class="coach-role">${coach.role}</span>
      </div>
      <button class="coach-avatar-gen btn-mini" data-tab="${tab}" title="Generate AI face">✨</button>
    `;
    container.insertBefore(header, container.firstChild);

    // Apply cached face if we already generated one.
    if (this.cache[tab]) this.applyFace(tab, this.cache[tab]);

    header.querySelector('.coach-avatar-gen').addEventListener('click', () => this.generate(tab));
  }

  applyFace(tab, url) {
    const el = document.getElementById(`coach-avatar-${tab}`);
    if (!el) return;
    el.style.backgroundImage = `url(${url})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    const fallback = el.querySelector('.coach-avatar-fallback');
    if (fallback) fallback.style.display = 'none';
  }

  setGenState(tab, state) {
    const btn = document.querySelector(`.coach-avatar-gen[data-tab="${tab}"]`);
    const el = document.getElementById(`coach-avatar-${tab}`);
    if (!btn) return;
    if (state === 'loading') {
      btn.textContent = '⏳';
      btn.disabled = true;
      if (el) el.classList.add('generating');
    } else {
      btn.textContent = '✨';
      btn.disabled = false;
      if (el) el.classList.remove('generating');
    }
  }

  async generate(tab) {
    const coach = this.coaches[tab];
    if (!coach) return;

    if (!this.hasToken()) {
      this._toast('Add a Replicate token in Settings to generate AI faces — your styled icon stays for now.');
      return;
    }

    this.setGenState(tab, 'loading');
    try {
      const url = await this._runFlux(coach.prompt);
      if (url) {
        this.cache[tab] = url;
        localStorage.setItem('coach-avatar-cache', JSON.stringify(this.cache));
        this.applyFace(tab, url);
      } else {
        this._toast('Could not generate the face right now — your styled icon stays in place.');
      }
    } catch (err) {
      console.error('Avatar generation failed:', err);
      this._toast('Face generation needs a network connection — using your styled icon for now.');
    } finally {
      this.setGenState(tab, 'idle');
    }
  }

  // Generate all four faces sequentially (used by a "Generate all" action).
  async generateAll() {
    for (const tab of Object.keys(this.coaches)) {
      await this.generate(tab);
    }
  }

  // Non-blocking toast — replaces jarring alert() popups.
  _toast(msg) {
    let t = document.getElementById('coach-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'coach-toast';
      t.className = 'coach-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  // Call Replicate FLUX 1.1 Pro with Prefer: wait so it returns synchronously (no polling loop).
  async _runFlux(prompt) {
    const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90,
          safety_tolerance: 2,
        },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Replicate error:', res.status, txt);
      return null;
    }

    const data = await res.json();
    // FLUX returns either a single URL string or an array of URLs in `output`.
    const out = data.output;
    if (Array.isArray(out)) return out[0];
    if (typeof out === 'string') return out;
    return null;
  }
}
