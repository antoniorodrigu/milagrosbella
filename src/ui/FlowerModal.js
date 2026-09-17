export class FlowerModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'flower-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="flower-modal-close" type="button" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div id="flower-modal-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#flower-modal-close');
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

  open(flowerData) {
    if (!flowerData || !flowerData.card) return;

    const content = this.element.querySelector('#flower-modal-content');
    const card = flowerData.card;

    const paragraphsHtml = (card.paragraphs || [])
      .map(p => `<p>${p}</p>`)
      .join('');

    const highlightHtml = card.highlight
      ? `<div class="card-highlight-area">
          <p class="highlight-main-text">${card.highlight}</p>
        </div>`
      : '';

    const footnoteHtml = card.footnote
      ? `<p class="card-footnote">${card.footnote}</p>`
      : '';

    content.innerHTML = `
      <div class="card-category-label">
        <span>${flowerData.subtitle || 'Celebrando tu ascenso'}</span>
      </div>

      <h2 class="card-title">${card.title || flowerData.title}</h2>

      <div class="card-body">
        ${paragraphsHtml}
        ${highlightHtml}
        ${footnoteHtml}
      </div>
    `;

    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
