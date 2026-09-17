import { gardenData } from '../data/milagros.js';

export class AccessibilityView {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.isOpen = false;

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.className = 'accessibility-panel';
    this.element.id = 'accessibility-panel';
    this.element.setAttribute('aria-label', 'Dedicatoria y lectura para Milagros');

    const createDivider = (isHeart = true) => `
      <div class="letter-divider" aria-hidden="true">
        <span class="letter-divider-line"></span>
        <span class="letter-divider-icon">
          ${isHeart ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                stroke="rgba(247, 184, 198, 0.65)" stroke-width="1.2" fill="rgba(225, 75, 115, 0.25)"/>
            </svg>
          ` : `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
                stroke="rgba(247, 184, 198, 0.5)" stroke-width="1.1" fill="rgba(240, 197, 134, 0.2)"/>
            </svg>
          `}
        </span>
        <span class="letter-divider-line"></span>
      </div>
    `;

    // 1. Flowers HTML - pure editorial, zero nested cards
    const flowersHtml = gardenData.flowers.map(f => {
      const paragraphsHtml = (f.card.paragraphs || [])
        .map(p => `<p class="letter-paragraph">${p}</p>`)
        .join('');

      const highlightHtml = f.card.highlight
        ? `
          <div class="letter-quote-block">
            <div class="letter-quote-glyph" aria-hidden="true">“</div>
            <p class="letter-quote-highlight">${f.card.highlight}</p>
            <div class="letter-quote-glyph close-glyph" aria-hidden="true">”</div>
          </div>
        `
        : '';

      const footnoteHtml = f.card.footnote
        ? `<p class="letter-footnote">${f.card.footnote}</p>`
        : '';

      return `
        <div class="letter-flower-article">
          <span class="letter-kicker">${f.subtitle || 'Celebrando tu ascenso'}</span>
          <h3 class="letter-article-title">${f.card.title}</h3>
          
          <div class="letter-article-prose">
            ${paragraphsHtml}
            ${highlightHtml}
            ${footnoteHtml}
          </div>
        </div>
      `;
    }).join('');

    // 2. Bench Notes HTML - numbered romantic verses
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
    const benchNotesHtml = gardenData.bench.notes.map((n, i) => `
      <div class="letter-verse-item">
        <span class="letter-verse-number">${romanNumerals[i] || i + 1}.</span>
        <p class="letter-verse-text">“${n.content}”</p>
      </div>
    `).join('');

    // 3. Fountain Thoughts HTML - clean poetic list
    const fountainThoughtsHtml = gardenData.fountain.thoughts.map((t) => `
      <li class="letter-thought-item">
        <span class="thought-bullet" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="6" fill="rgba(247, 184, 198, 0.45)"/>
          </svg>
        </span>
        <span class="thought-content">“${t}”</span>
      </li>
    `).join('');

    this.element.innerHTML = `
      <div class="letter-wrapper">
        <!-- Top Minimal Header -->
        <header class="letter-top-nav">
          <span class="letter-meta-label">Para ${gardenData.dedication.recipient}</span>
          <button class="letter-back-btn" id="btn-close-access" type="button" aria-label="Volver al jardín 3D">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Volver al jardín</span>
          </button>
        </header>

        <!-- Monumental Editorial Header -->
        <div class="letter-hero">
          <span class="letter-eyebrow">DEDICATORIA ESPECIAL</span>
          <h1 class="letter-title">Un jardín para ${gardenData.dedication.recipient}</h1>
          <p class="letter-subtitle">“${gardenData.dedication.subtitle}”</p>
          ${createDivider(true)}
        </div>

        <!-- Section 1: Detalles y Flores -->
        <section class="letter-section">
          <div class="letter-section-header">
            <h2 class="letter-section-title">Detalles y Flores</h2>
            <p class="letter-section-subtitle">Rosas cultivadas con historias y motivos para celebrar.</p>
          </div>
          
          <div class="letter-section-content">
            ${flowersHtml}
          </div>
        </section>

        ${createDivider(false)}

        <!-- Section 2: Notas de la banca -->
        <section class="letter-section">
          <div class="letter-section-header">
            <h2 class="letter-section-title">Notas de la banca</h2>
            <p class="letter-section-subtitle">Tres pensamientos para leer con calma.</p>
          </div>

          <div class="letter-verses-flow">
            ${benchNotesHtml}
          </div>
        </section>

        ${createDivider(false)}

        <!-- Section 3: Reflexiones de la fuente -->
        <section class="letter-section">
          <div class="letter-section-header">
            <h2 class="letter-section-title">Reflexiones de la fuente</h2>
            <p class="letter-section-subtitle">Pequeños pensamientos inspirados en la calma y el agua serena.</p>
          </div>

          <ul class="letter-thoughts-list">
            ${fountainThoughtsHtml}
          </ul>
        </section>

        ${createDivider(false)}

        <!-- Section 4: Momentos por florecer -->
        <section class="letter-section">
          <div class="letter-section-header">
            <h2 class="letter-section-title">Momentos por florecer</h2>
            <p class="letter-section-subtitle">Espacios que esperan nuevas historias por escribir.</p>
          </div>

          <div class="letter-future-block">
            <p class="letter-future-line">“Todavía no hay muchas fotografías aquí.”</p>
            <p class="letter-future-line highlight-phrase">“Y quizás eso sea justamente lo bonito.”</p>
            <p class="letter-future-line">“Hay momentos que todavía no han sucedido.”</p>
            <p class="letter-future-subtext">
              Este jardín apenas comienza. Nuevas flores y detalles aparecerán conforme tengamos más historias que contar.
            </p>
          </div>
        </section>

        <!-- Romantic Dedication Footer -->
        <footer class="letter-footer">
          ${createDivider(true)}
          
          <div class="letter-footer-block">
            <p class="letter-footer-note">Creado con cariño y cuidado</p>
            <h3 class="letter-footer-name">Para Milagros</h3>
            <div class="letter-heart-symbol" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  stroke="#f7b8c6" stroke-width="1.2" fill="rgba(225, 75, 115, 0.35)"/>
              </svg>
            </div>
          </div>

          <div class="letter-footer-actions">
            <button class="letter-footer-btn" id="btn-footer-return" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>Volver a explorar el jardín</span>
            </button>
          </div>
        </footer>
      </div>
    `;

    this.container.appendChild(this.element);

    const closeBtn = this.element.querySelector('#btn-close-access');
    const footerReturnBtn = this.element.querySelector('#btn-footer-return');

    closeBtn.addEventListener('click', () => this.toggle());
    if (footerReturnBtn) {
      footerReturnBtn.addEventListener('click', () => this.toggle());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggle();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.element.classList.add('is-active');
      this.element.scrollTop = 0;
    } else {
      this.element.classList.remove('is-active');
      if (this.onClose) this.onClose();
    }
    return this.isOpen;
  }
}


