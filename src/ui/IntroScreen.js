import { gardenData } from '../data/milagros.js';

export class IntroScreen {
  constructor(container, onEnter) {
    this.container = container;
    this.onEnter = onEnter;
    this.element = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'intro-screen';
    this.element.id = 'intro-screen';

    const createHeartSvg = (size = 20) => `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
          stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.16"/>
      </svg>
    `;

    const risingHeartsConfig = [
      { id: 'rh1', left: '6%', size: 22, color: '#e592a5', maxOp: 0.58, dur: '12s', delay: '-3s', driftX: '24px', rot: '6deg', isMobile: true },
      { id: 'rh2', left: '16%', size: 16, color: '#f3c4ce', maxOp: 0.45, dur: '15s', delay: '-8s', driftX: '-18px', rot: '-5deg', isMobile: true },
      { id: 'rh3', left: '85%', size: 24, color: '#f0b5c2', maxOp: 0.55, dur: '11s', delay: '-2s', driftX: '-25px', rot: '-7deg', isMobile: true },
      { id: 'rh4', left: '93%', size: 18, color: '#dda0af', maxOp: 0.48, dur: '14s', delay: '-9s', driftX: '20px', rot: '5deg', isMobile: true },
      { id: 'rh5', left: '11%', size: 28, color: '#c95e76', maxOp: 0.38, dur: '17s', delay: '-12s', driftX: '30px', rot: '8deg', isMobile: false },
      { id: 'rh6', left: '88%', size: 20, color: '#f5d2db', maxOp: 0.52, dur: '13s', delay: '-6s', driftX: '-22px', rot: '-6deg', isMobile: false }
    ];

    const driftingHeartsConfig = [
      { id: 'dh1', left: '5%', top: '24%', size: 20, color: '#e89eb0', baseOp: 0.55, dur: '10s', delay: '-2s', isMobile: true },
      { id: 'dh2', left: '8%', top: '65%', size: 24, color: '#d97d92', baseOp: 0.5, dur: '12s', delay: '-5s', isMobile: true },
      { id: 'dh3', left: '92%', top: '28%', size: 22, color: '#f1b8c4', baseOp: 0.52, dur: '11s', delay: '-3s', isMobile: true },
      { id: 'dh4', left: '90%', top: '68%', size: 18, color: '#f8dbe1', baseOp: 0.48, dur: '13s', delay: '-7s', isMobile: true },
      { id: 'dh5', left: '22%', top: '10%', size: 16, color: '#eed0d8', baseOp: 0.42, dur: '9s', delay: '-1s', isMobile: false },
      { id: 'dh6', left: '78%', top: '88%', size: 26, color: '#b94e66', baseOp: 0.35, dur: '14s', delay: '-4s', isMobile: false }
    ];

    const risingHtml = risingHeartsConfig.map(h => `
      <div class="heart-rising ${h.isMobile ? 'show-mobile' : 'hide-mobile'}"
        id="${h.id}"
        style="
          left: ${h.left};
          color: ${h.color};
          --max-opacity: ${h.maxOp};
          --drift-x: ${h.driftX};
          --rot: ${h.rot};
          animation: floatUp ${h.dur} ${h.delay} linear infinite;
        "
        aria-hidden="true">
        <div class="heart-inner-pulse" style="animation: gentlePulse 3.8s ease-in-out infinite;">
          ${createHeartSvg(h.size)}
        </div>
      </div>
    `).join('');

    const driftingHtml = driftingHeartsConfig.map(h => `
      <div class="heart-drifting ${h.isMobile ? 'show-mobile' : 'hide-mobile'}"
        id="${h.id}"
        style="
          left: ${h.left};
          top: ${h.top};
          color: ${h.color};
          --base-opacity: ${h.baseOp};
          animation: softDrift ${h.dur} ${h.delay} ease-in-out infinite;
        "
        aria-hidden="true">
        <div class="heart-inner-pulse" style="animation: gentlePulse 4.2s ease-in-out infinite;">
          ${createHeartSvg(h.size)}
        </div>
      </div>
    `).join('');

    this.element.innerHTML = `
      <div class="intro-ambient-glow" aria-hidden="true"></div>

      <div class="intro-watermark-heart" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            stroke="rgba(245, 190, 205, 0.16)" stroke-width="0.75" fill="rgba(215, 85, 115, 0.04)"/>
        </svg>
      </div>

      <div class="intro-hearts-container" aria-hidden="true">
        ${risingHtml}
        ${driftingHtml}
      </div>

      <div class="intro-content">
        <div class="intro-ornament intro-step-1"></div>
        <h1 class="intro-title intro-step-2">Para ${gardenData.dedication.recipient}</h1>
        <p class="intro-subtitle intro-step-3">${gardenData.dedication.subtitle}</p>
        <div class="intro-step-4">
          <button class="btn-intro-enter" id="btn-enter-garden" type="button" aria-label="Entrar al jardín">
            ${gardenData.dedication.enterButtonText}
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    this.initHeartInteractions();

    const btn = this.element.querySelector('#btn-enter-garden');
    btn.addEventListener('click', () => {
      const clickTime = performance.now();
      btn.classList.add('is-clicked');
      
      const transitionStartTime = performance.now();
      this.hide();

      if (this.onEnter) {
        this.onEnter({ clickTime, transitionStartTime });
      }
    });
  }

  initHeartInteractions() {
    const hearts = this.element.querySelectorAll('.heart-rising, .heart-drifting');
    hearts.forEach(heart => {
      heart.addEventListener('mouseenter', () => {
        heart.classList.add('heart-hovered');
      });
      heart.addEventListener('mouseleave', () => {
        heart.classList.remove('heart-hovered');
      });
    });
  }

  hide() {
    if (this.element) {
      this.element.classList.add('is-hidden');
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.remove();
          this.element = null;
        }
      }, 380);
    }
  }
}
