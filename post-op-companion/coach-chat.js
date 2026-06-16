// Voice Coach Chat — a real conversation with the AI recovery coach.
// • Type a message OR tap the mic to speak (Web Speech API speech-to-text).
// • Claude replies (claude-ai.js → chat()).
// • The reply is spoken aloud with a natural voice (voice.js → window.voice).
class CoachChat {
  constructor() {
    this.history = [];               // [{role, content}] for the Claude API
    this.recognizing = false;
    this.recognition = null;
    this.els = {};
    document.addEventListener('DOMContentLoaded', () => this.mount());
  }

  mount() {
    this.els.log = document.getElementById('chat-log');
    this.els.input = document.getElementById('chat-input');
    this.els.send = document.getElementById('chat-send');
    this.els.mic = document.getElementById('chat-mic');
    if (!this.els.log) return; // chat UI not on this page

    this.els.send.addEventListener('click', () => this.handleSend());
    this.els.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.handleSend(); }
    });
    this.els.mic.addEventListener('click', () => this.toggleMic());

    this._setupRecognition();

    // Friendly opening line.
    this.addBubble('coach', "Hi, I'm your recovery coach 💛 Ask me anything about your meals, movement, sleep, meds, or how you're feeling. Tap the mic to talk to me.");
  }

  // ---- Speech-to-text (voice input) ----
  _setupRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { this.els.mic.style.display = 'none'; return; } // unsupported → hide mic
    this.recognition = new SR();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      this.els.input.value = text;
      this.handleSend();
    };
    this.recognition.onend = () => { this.recognizing = false; this.els.mic.classList.remove('listening'); };
    this.recognition.onerror = () => { this.recognizing = false; this.els.mic.classList.remove('listening'); };
  }

  toggleMic() {
    if (!this.recognition) return;
    if (this.recognizing) {
      this.recognition.stop();
      return;
    }
    // Stop any current speech so the mic doesn't hear the coach.
    if (window.voice) window.voice.stop();
    try {
      this.recognition.start();
      this.recognizing = true;
      this.els.mic.classList.add('listening');
    } catch (_) { /* already started */ }
  }

  // ---- Send a message and get the coach's reply ----
  async handleSend() {
    const text = (this.els.input.value || '').trim();
    if (!text) return;
    this.els.input.value = '';

    this.addBubble('user', text);
    this.history.push({ role: 'user', content: text });

    const typing = this.addBubble('coach', '…', true);

    let reply;
    try {
      reply = await (window.claudeAI ? window.claudeAI.chat(this.history) : claudeAI.chat(this.history));
    } catch (e) {
      reply = "I couldn't connect just now. Please try again in a moment.";
    }

    typing.remove();
    this.addBubble('coach', reply);
    this.history.push({ role: 'assistant', content: reply });

    // Speak the reply aloud (natural voice with system fallback).
    if (window.voice) window.voice.speak(reply);
  }

  addBubble(who, text, isTyping = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${who}` + (isTyping ? ' typing' : '');
    bubble.textContent = text;
    this.els.log.appendChild(bubble);
    this.els.log.scrollTop = this.els.log.scrollHeight;
    return bubble;
  }
}

// claude-ai.js creates `claudeAI`; expose it on window for the chat module.
if (typeof claudeAI !== 'undefined' && typeof window !== 'undefined') window.claudeAI = claudeAI;
window.coachChat = new CoachChat();
