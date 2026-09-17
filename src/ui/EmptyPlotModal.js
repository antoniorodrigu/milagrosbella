export class EmptyPlotModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'empty-plot-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card" style="text-align: center;">
        <button class="modal-close-btn" id="empty-plot-modal-close" type="button" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="card-category-label">
          <span>Un espacio que espera</span>
        </div>

        <h2 class="card-title" style="margin-bottom: 24px;">Momentos que todavía no existen</h2>

        <div id="empty-plot-phrases" style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <!-- Phrases -->
        </div>

        <p class="card-footnote">
          No quiero inventar recuerdos antes de vivirlos. Prefiero dejarles un lugar por si algún día llegan.
        </p>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#empty-plot-modal-close');
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

  open(plotData) {
    const phrasesContainer = this.element.querySelector('#empty-plot-phrases');
    const phrases = plotData?.phrases || [
      "Este espacio está casi vacío.",
      "Y me gusta que sea así.",
      "Significa que todavía quedan conversaciones, lugares, fotografías y pequeños momentos que podrían algún día llegar hasta aquí."
    ];

    phrasesContainer.innerHTML = phrases
      .map(p => `<div style="font-family: var(--font-serif); font-size: 1.22rem; font-style: italic; color: var(--text-muted); line-height: 1.55;">“${p}”</div>`)
      .join('');

    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
