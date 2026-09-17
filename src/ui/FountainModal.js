import { gardenData } from '../data/milagros.js';

export class FountainModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.lastThoughtIndex = -1;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'fountain-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card" style="text-align: center;">
        <button class="modal-close-btn" id="fountain-modal-close" type="button" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="card-category-label">
          <span>Agua y reflejos</span>
        </div>

        <h2 class="card-title">${gardenData.fountain.title}</h2>
        <p class="card-footnote" style="margin-top: -10px; margin-bottom: 24px;">${gardenData.fountain.subtitle}</p>

        <div class="fountain-interactive-area">
          <button class="fountain-water-btn" id="fountain-ripple-btn" type="button" aria-label="Tocar el agua para descubrir un pensamiento">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </button>
          
          <div class="fountain-thought-box" id="fountain-thought-text">
            “Toca el agua para descubrir un nuevo pensamiento.”
          </div>

          <button class="btn-secondary" id="fountain-new-thought-btn" type="button">
            <span>Otro pensamiento</span>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#fountain-modal-close');
    closeBtn.addEventListener('click', () => this.close());

    const waterBtn = this.element.querySelector('#fountain-ripple-btn');
    const newThoughtBtn = this.element.querySelector('#fountain-new-thought-btn');

    waterBtn.addEventListener('click', () => this.generateRandomThought());
    newThoughtBtn.addEventListener('click', () => this.generateRandomThought());

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

  generateRandomThought() {
    const thoughts = gardenData.fountain.thoughts || [];
    if (thoughts.length === 0) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * thoughts.length);
    } while (thoughts.length > 1 && nextIndex === this.lastThoughtIndex);

    this.lastThoughtIndex = nextIndex;
    const textEl = this.element.querySelector('#fountain-thought-text');

    textEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = `“${thoughts[nextIndex]}”`;
      textEl.style.opacity = '1';
    }, 200);
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
