import { gardenData } from '../data/milagros.js';

export class Navigation {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks || {};
    this.topBar = null;
    this.bottomNav = null;
    this.activeSection = 'jardin';

    this.render();
  }

  render() {
    this.renderTopBar();
    this.renderBottomNav();
  }

  getDetailsCount() {
    const flowerCount = (gardenData.flowers || []).length;
    const surpriseBonus = gardenData.newDetailSurprise?.hasNewSurprise ? 1 : 0;
    const total = flowerCount + surpriseBonus;
    return String(total).padStart(2, '0');
  }

  renderTopBar() {
    this.topBar = document.createElement('header');
    this.topBar.className = 'top-bar';
    this.topBar.innerHTML = `
      <div class="top-bar-left">
        <div class="garden-badge">
          <span class="garden-badge-label">Para</span>
          <span class="garden-badge-title">${gardenData.dedication.recipient}</span>
        </div>
      </div>

      <div class="top-bar-right">
        <button class="icon-btn" id="btn-access-toggle" type="button" aria-label="Modo lectura accesible" title="Modo lectura accesible">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <line x1="4" y1="7" x2="20" y2="7"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="17" x2="20" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    this.container.appendChild(this.topBar);

    const accessBtn = this.topBar.querySelector('#btn-access-toggle');
    accessBtn.addEventListener('click', () => {
      if (this.callbacks.onToggleAccessibility) {
        this.callbacks.onToggleAccessibility();
      }
    });
  }

  renderBottomNav() {
    this.bottomNav = document.createElement('nav');
    this.bottomNav.className = 'bottom-nav';
    this.bottomNav.setAttribute('aria-label', 'Navegación del jardín');

    this.bottomNav.innerHTML = `
      <button class="nav-item is-active" type="button" data-section="jardin">
        <span>Jardín</span>
      </button>
      <button class="nav-item" type="button" data-section="detalles">
        <span>Detalles</span>
      </button>
      <button class="nav-item" type="button" data-section="mensajes">
        <span>Mensajes</span>
      </button>
      <button class="nav-item" type="button" data-section="momentos">
        <span>Momentos</span>
      </button>
    `;

    this.container.appendChild(this.bottomNav);

    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        this.setActiveSection(section);
        if (this.callbacks.onNavigate) {
          this.callbacks.onNavigate(section);
        }
      });
    });
  }

  setActiveSection(section) {
    this.activeSection = section;
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-section') === section) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  updateCounter() {
    const counterEl = this.topBar.querySelector('#nav-counter-number');
    if (counterEl) {
      counterEl.textContent = this.getDetailsCount();
    }
  }
}
