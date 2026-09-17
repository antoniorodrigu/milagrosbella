import { gardenData } from '../data/milagros.js';

export class FountainModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.lastThoughtIndex = -1;
    this.isTransitioning = false;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'fountain-experience-overlay';
    this.element.id = 'fountain-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('aria-label', 'Fuente de los pequeños detalles');

    this.element.innerHTML = `
      <!-- Minimal Floating Close Button -->
      <button class="fountain-close-btn" id="fountain-modal-close" type="button" aria-label="Cerrar ventana">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="fountain-close-label">Cerrar</span>
      </button>

      <!-- Ambient Botanical SVG Accents (Free & Atmospheric) -->
      <div class="fountain-bg-accents" aria-hidden="true">
        <svg class="fountain-accent-branch branch-left" width="160" height="320" viewBox="0 0 160 320" fill="none">
          <path d="M10 310 C40 240, 30 160, 110 80 C130 60, 140 40, 150 10" stroke="rgba(201, 138, 156, 0.22)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M45 220 C65 210, 85 218, 90 230 C80 238, 60 235, 45 220 Z" fill="rgba(201, 138, 156, 0.08)" stroke="rgba(201, 138, 156, 0.18)" stroke-width="0.8"/>
          <path d="M70 155 C90 142, 110 148, 118 160 C108 168, 85 166, 70 155 Z" fill="rgba(201, 138, 156, 0.08)" stroke="rgba(201, 138, 156, 0.18)" stroke-width="0.8"/>
          <path d="M110 80 C128 68, 145 74, 150 86 C140 92, 122 90, 110 80 Z" fill="rgba(201, 138, 156, 0.08)" stroke="rgba(201, 138, 156, 0.18)" stroke-width="0.8"/>
        </svg>

        <svg class="fountain-accent-branch branch-right" width="160" height="320" viewBox="0 0 160 320" fill="none">
          <path d="M150 310 C120 240, 130 160, 50 80 C30 60, 20 40, 10 10" stroke="rgba(201, 138, 156, 0.18)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M115 220 C95 210, 75 218, 70 230 C80 238, 100 235, 115 220 Z" fill="rgba(201, 138, 156, 0.06)" stroke="rgba(201, 138, 156, 0.14)" stroke-width="0.8"/>
          <path d="M90 155 C70 142, 50 148, 42 160 C52 168, 75 166, 90 155 Z" fill="rgba(201, 138, 156, 0.06)" stroke="rgba(201, 138, 156, 0.14)" stroke-width="0.8"/>
        </svg>
      </div>

      <div class="fountain-stage">
        <!-- 1. Header: Pure Typography & Discreet -->
        <header class="fountain-header">
          <span class="fountain-eyebrow">AGUA Y REFLEJOS</span>
          <h2 class="fountain-title">${gardenData.fountain.title}</h2>
          <p class="fountain-subtitle">${gardenData.fountain.subtitle}</p>
        </header>

        <!-- 2. Stylized Visual Water Surface (CSS & SVG) -->
        <div class="fountain-water-wrapper">
          <div class="fountain-water-surface" id="fountain-water-surface" role="button" tabindex="0" aria-label="Tocar el agua para descubrir un pensamiento">
            <svg class="fountain-water-svg" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="fountainPoolGrad" cx="48%" cy="40%" r="55%">
                  <stop offset="0%" stop-color="#54152A" stop-opacity="0.95"/>
                  <stop offset="42%" stop-color="#3A0C1E" stop-opacity="0.98"/>
                  <stop offset="82%" stop-color="#240713" stop-opacity="1"/>
                  <stop offset="100%" stop-color="#18040B" stop-opacity="1"/>
                </radialGradient>
                <linearGradient id="fountainRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="rgba(242, 231, 225, 0.55)"/>
                  <stop offset="35%" stop-color="rgba(201, 138, 156, 0.4)"/>
                  <stop offset="70%" stop-color="rgba(84, 21, 42, 0.25)"/>
                  <stop offset="100%" stop-color="rgba(201, 167, 106, 0.35)"/>
                </linearGradient>
                <filter id="fountainGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>

              <!-- Outer Atmospheric Glow -->
              <ellipse cx="130" cy="70" rx="122" ry="62" fill="rgba(84, 21, 42, 0.35)" filter="url(#fountainGlowFilter)"/>

              <!-- Water Basin Bed -->
              <ellipse class="water-basin" cx="130" cy="70" rx="118" ry="58" fill="url(#fountainPoolGrad)" stroke="url(#fountainRimGrad)" stroke-width="1.3"/>

              <!-- Concentric Breathing Water Rings -->
              <ellipse class="water-ring ring-1" cx="130" cy="70" rx="86" ry="42" stroke="rgba(201, 138, 156, 0.24)" stroke-width="0.9" fill="none"/>
              <ellipse class="water-ring ring-2" cx="130" cy="70" rx="56" ry="27" stroke="rgba(242, 231, 225, 0.2)" stroke-width="0.8" fill="none"/>
              <ellipse class="water-ring ring-3" cx="130" cy="70" rx="28" ry="14" stroke="rgba(201, 167, 106, 0.26)" stroke-width="0.8" fill="none"/>

              <!-- Subtle Water Shimmer -->
              <path class="water-sheen" d="M60 52 C90 40, 160 42, 200 58 C170 48, 100 46, 60 52 Z" fill="rgba(242, 231, 225, 0.22)"/>
              <ellipse cx="145" cy="55" rx="12" ry="4" fill="rgba(242, 231, 225, 0.32)" transform="rotate(-6 145 55)"/>
            </svg>

            <!-- Dynamic Interactive Ripple Wave Layer -->
            <div class="fountain-ripples-layer" id="fountain-ripples-layer"></div>

            <!-- Gentle Floating Petal -->
            <div class="fountain-floating-petal" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 C16 8, 20 12, 20 16 C20 20, 16 22, 12 22 C8 22, 4 20, 4 16 C4 12, 8 8, 12 2 Z" fill="rgba(201, 138, 156, 0.45)" stroke="rgba(242, 231, 225, 0.3)" stroke-width="0.8" transform="rotate(25 12 12)"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 3. Reflection / Thought (Pure Typography, Open Space) -->
        <div class="fountain-reflection-wrap">
          <blockquote class="fountain-thought-prose" id="fountain-thought-text">
            “Las historias más bonitas normalmente empiezan sin saber cómo terminarán.”
          </blockquote>

          <!-- 4. Minimalist Text Link -->
          <button class="fountain-next-link" id="fountain-next-link" type="button">
            <span>Descubrir otro pensamiento</span>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#fountain-modal-close');
    closeBtn.addEventListener('click', () => this.close());

    const waterSurface = this.element.querySelector('#fountain-water-surface');
    const nextLink = this.element.querySelector('#fountain-next-link');

    // Water click / touch ripple interaction
    waterSurface.addEventListener('click', (e) => {
      this.handleWaterTouch(e);
    });

    waterSurface.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleWaterTouch(null);
      }
    });

    nextLink.addEventListener('click', () => {
      this.handleWaterTouch(null);
    });

    // Close when clicking empty backdrop outside stage
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.element.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  handleWaterTouch(event) {
    const waterSurface = this.element.querySelector('#fountain-water-surface');
    const ripplesLayer = this.element.querySelector('#fountain-ripples-layer');
    if (!waterSurface || !ripplesLayer) return;

    // Calculate relative point
    let x = 130;
    let y = 70;

    if (event && event.clientX && event.clientY) {
      const rect = waterSurface.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      // Add a slight natural variance near center
      x = 130 + (Math.random() * 20 - 10);
      y = 70 + (Math.random() * 12 - 6);
    }

    // 1. Create expanding ripple wave
    const wave = document.createElement('span');
    wave.className = 'fountain-ripple-wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    ripplesLayer.appendChild(wave);

    setTimeout(() => {
      if (wave && wave.parentNode) {
        wave.parentNode.removeChild(wave);
      }
    }, 1200);

    // 2. Gentle illumination pulse on water surface
    waterSurface.classList.add('is-pulsing');
    setTimeout(() => {
      waterSurface.classList.remove('is-pulsing');
    }, 700);

    // 3. Smooth transition to next thought
    this.generateRandomThought();
  }

  generateRandomThought() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const thoughts = gardenData.fountain.thoughts || [];
    if (thoughts.length === 0) {
      this.isTransitioning = false;
      return;
    }

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * thoughts.length);
    } while (thoughts.length > 1 && nextIndex === this.lastThoughtIndex);

    this.lastThoughtIndex = nextIndex;
    const textEl = this.element.querySelector('#fountain-thought-text');

    if (textEl) {
      // Step 1: Smooth fade out
      textEl.classList.add('is-fading');

      // Step 2: Swap text & smooth fade in
      setTimeout(() => {
        textEl.textContent = `“${thoughts[nextIndex]}”`;
        textEl.classList.remove('is-fading');
        this.isTransitioning = false;
      }, 350);
    } else {
      this.isTransitioning = false;
    }
  }

  open() {
    this.generateRandomThought();
    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
