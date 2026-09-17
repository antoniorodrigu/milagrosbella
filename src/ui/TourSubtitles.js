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
    const subtitles = gardenData.dedication.initialTourSubtitles;
    if (!subtitles || subtitles.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    subtitles.forEach((sub, index) => {
      // Fade in
      setTimeout(() => {
        this.textElement.textContent = sub.text;
        this.textElement.classList.add('is-active');
      }, sub.delay);

      // Fade out
      setTimeout(() => {
        this.textElement.classList.remove('is-active');
        if (index === subtitles.length - 1 && onComplete) {
          setTimeout(onComplete, 800);
        }
      }, sub.delay + sub.duration);
    });
  }

  hide() {
    if (this.textElement) {
      this.textElement.classList.remove('is-active');
    }
  }
}
