import { gardenData } from '../data/milagros.js';

export class SurpriseModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'surprise-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="surprise-modal-close" type="button" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="card-category-label" id="surprise-badge">
          <span id="surprise-badge-text">Farol del jardín</span>
        </div>

        <div id="surprise-modal-content">
          <!-- Content -->
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#surprise-modal-close');
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
    const content = this.element.querySelector('#surprise-modal-content');
    const surpriseData = gardenData.newDetailSurprise;

    if (!surpriseData.hasNewSurprise) {
      content.innerHTML = `
        <h2 class="card-title">${surpriseData.title}</h2>
        <div style="font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; color: var(--text-muted); margin: 20px 0;">
          “Este farol permanece en reposo por ahora.”
        </div>
        <p class="card-footnote">
          Cuando haya una sorpresa nueva o un detalle especial para ti, verás su luz encendida desde la entrada.
        </p>
      `;
    } else {
      const card = surpriseData.surpriseCard;
      const actionHtml = card.actionButton && card.actionButton.enabled
        ? `<div style="margin-top: 24px; text-align: center;"><a href="${card.actionButton.url}" target="_blank" class="btn-primary" style="text-decoration: none;">${card.actionButton.text}</a></div>`
        : '';

      content.innerHTML = `
        <h2 class="card-title">${card.title}</h2>
        <div style="font-size: 0.8rem; color: var(--text-accent-gold); margin-bottom: 12px;">${card.date}</div>
        <div class="card-body">
          <p>${card.message}</p>
        </div>
        ${actionHtml}
      `;
    }

    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
