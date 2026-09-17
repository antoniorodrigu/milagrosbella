import { gardenData } from '../data/milagros.js';

export class BenchModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.currentNoteIndex = 0;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'bench-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="modal-card bench-modal-card">
        <button class="modal-close-btn" id="bench-modal-close" type="button" aria-label="Cerrar dedicatoria">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <header class="bench-editorial-header">
          <span class="card-category-label">La banca de las notas</span>
          <h2 class="card-title">${gardenData.bench.title}</h2>
          <p class="bench-editorial-subtitle">${gardenData.bench.subtitle}</p>
        </header>

        <div class="bench-letter-body">
          <div class="bench-note-stage">
            <div class="bench-quote-accent top-accent" aria-hidden="true"></div>
            <p class="bench-letter-text" id="bench-note-text">
              <!-- Current Note -->
            </p>
            <div class="bench-quote-accent bottom-accent" aria-hidden="true"></div>
          </div>
        </div>

        <footer class="bench-editorial-footer">
          <span class="bench-counter-text" id="bench-counter-label">Nota 1 de 3</span>
          <div class="bench-action-group">
            <button class="bench-nav-btn" id="bench-prev-btn" type="button" aria-label="Nota anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Anterior</span>
            </button>
            <button class="bench-nav-btn" id="bench-next-btn" type="button" aria-label="Nota siguiente">
              <span>Siguiente</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </footer>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#bench-modal-close');
    closeBtn.addEventListener('click', () => this.close());

    const prevBtn = this.element.querySelector('#bench-prev-btn');
    const nextBtn = this.element.querySelector('#bench-next-btn');

    prevBtn.addEventListener('click', () => this.prevNote());
    nextBtn.addEventListener('click', () => this.nextNote());

    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!this.element.classList.contains('is-open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prevNote();
      if (e.key === 'ArrowRight') this.nextNote();
    });
  }

  updateNoteView() {
    const notes = gardenData.bench.notes || [];
    if (notes.length === 0) return;

    const textEl = this.element.querySelector('#bench-note-text');
    const counterEl = this.element.querySelector('#bench-counter-label');
    const prevBtn = this.element.querySelector('#bench-prev-btn');
    const nextBtn = this.element.querySelector('#bench-next-btn');

    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(4px)';

    setTimeout(() => {
      textEl.textContent = `“${notes[this.currentNoteIndex].content}”`;
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 150);

    counterEl.textContent = `Nota ${this.currentNoteIndex + 1} de ${notes.length}`;

    prevBtn.disabled = this.currentNoteIndex === 0;
    nextBtn.disabled = this.currentNoteIndex === notes.length - 1;
  }

  prevNote() {
    if (this.currentNoteIndex > 0) {
      this.currentNoteIndex--;
      this.updateNoteView();
    }
  }

  nextNote() {
    const notes = gardenData.bench.notes || [];
    if (this.currentNoteIndex < notes.length - 1) {
      this.currentNoteIndex++;
      this.updateNoteView();
    }
  }

  open() {
    this.currentNoteIndex = 0;
    this.updateNoteView();
    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}
