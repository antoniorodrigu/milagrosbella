import { gardenData } from '../data/milagros.js';

export class SecretPathModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'secret-path-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card" style="text-align: center;">
        <button class="modal-close-btn" id="secret-path-modal-close" type="button" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="card-category-label">
          <span>Sendero en calma</span>
        </div>

        <div id="secret-path-content">
          <!-- Content -->
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#secret-path-modal-close');
    closeBtn.addEventListener('click', () => this.close());

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

  open() {
    const content = this.element.querySelector('#secret-path-content');
    const secretPath = gardenData.secretPath;

    if (!secretPath.unlocked) {
      content.innerHTML = `
        <h2 class="card-title">${secretPath.closedMessage.title}</h2>
        <div style="font-family: var(--font-serif); font-size: 1.35rem; font-style: italic; color: var(--text-pure); margin: 20px 0;">
          “${secretPath.closedMessage.text}”
        </div>
        <p class="card-footnote">
          ${secretPath.closedMessage.subtext}
        </p>
      `;
    } else {
      content.innerHTML = `
        <h2 class="card-title">${secretPath.unlockedMessage.title}</h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); margin: 20px 0;">
          ${secretPath.unlockedMessage.text}
        </p>
        <a href="${secretPath.unlockedMessage.linkUrl}" target="_blank" class="btn-primary" style="text-decoration: none;">
          ${secretPath.unlockedMessage.linkText}
        </a>
      `;
    }

    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
