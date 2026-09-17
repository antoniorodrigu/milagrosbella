import { gardenData } from '../data/milagros.js';

export class TourSubtitles {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.textElement = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'tour-subtitles-container';
    this.element.innerHTML = `
      <p class="tour-subtitle-text" id="tour-subtitle-text"></p>
    `;
    this.container.appendChild(this.element);
    this.textElement = this.element.querySelector('#tour-subtitle-text');
  }

  playSubtitles(onComplete) {
    if (this.timeouts) {
      this.timeouts.forEach(t => clearTimeout(t));
    }
    this.timeouts = [];

    const subtitles = gardenData.dedication.initialTourSubtitles;
    if (!subtitles || subtitles.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    subtitles.forEach((sub, index) => {
      // Fade in
      const tIn = setTimeout(() => {
        if (this.textElement) {
          this.textElement.textContent = sub.text;
          this.textElement.classList.add('is-active');
        }
      }, sub.delay);
      this.timeouts.push(tIn);

      // Fade out
      const tOut = setTimeout(() => {
        if (this.textElement) {
          this.textElement.classList.remove('is-active');
        }
        if (index === subtitles.length - 1 && onComplete) {
          const tDone = setTimeout(onComplete, 600);
          this.timeouts.push(tDone);
        }
      }, sub.delay + sub.duration);
      this.timeouts.push(tOut);
    });
  }

  showFloatingMessage(text = 'Bienvenida, Milagros', duration = 3200) {
    this.hide();

    const tIn = setTimeout(() => {
      if (this.textElement) {
        this.textElement.textContent = text;
        this.textElement.classList.add('is-active');
      }
    }, 280);
    this.timeouts.push(tIn);

    const tOut = setTimeout(() => {
      if (this.textElement) {
        this.textElement.classList.remove('is-active');
      }
    }, 280 + duration);
    this.timeouts.push(tOut);
  }

  hide() {
    if (this.timeouts) {
      this.timeouts.forEach(t => clearTimeout(t));
      this.timeouts = [];
    }
    if (this.textElement) {
      this.textElement.classList.remove('is-active');
    }
  }
}
