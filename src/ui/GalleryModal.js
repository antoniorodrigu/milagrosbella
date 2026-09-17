import { fetchMemories, uploadMemory, deleteMemory } from '../services/memoriesService.js';

export class GalleryModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.isOpen = false;

    this.memories = [];
    this.isLoading = false;
    this.activeViewerIndex = -1;
    this.isUploadOpen = false;
    this.selectedFile = null;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'gallery-backdrop';
    this.element.id = 'gallery-modal';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    this.element.innerHTML = `
      <div class="gallery-scroll-container">
        <!-- Top Minimal Nav -->
        <header class="gallery-top-nav">
          <span class="gallery-nav-label">Álbum privado</span>
          <button class="gallery-nav-back-btn" id="gallery-close-btn" type="button" aria-label="Volver al jardín">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Volver al jardín</span>
          </button>
        </header>

        <!-- Main Hero Header -->
        <div class="gallery-hero">
          <span class="gallery-eyebrow">RECUERDOS</span>
          <h1 class="gallery-title">Galería de momentos</h1>
          <p class="gallery-subtitle">“Un lugar para guardar aquello que merece quedarse.”</p>
          
          <div class="gallery-divider" aria-hidden="true">
            <span class="gallery-divider-line"></span>
            <span class="gallery-divider-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  stroke="rgba(247, 184, 198, 0.65)" stroke-width="1.2" fill="rgba(225, 75, 115, 0.25)"/>
              </svg>
            </span>
            <span class="gallery-divider-line"></span>
          </div>

          <div class="gallery-hero-actions">
            <button class="gallery-add-btn" id="gallery-open-upload-btn" type="button" aria-label="Agregar un recuerdo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Agregar un recuerdo</span>
            </button>
          </div>
        </div>

        <!-- Gallery Body (Masonry or Empty State) -->
        <div class="gallery-body" id="gallery-body-content">
          <!-- Dynamic Content -->
        </div>
      </div>

      <!-- Upload Modal Overlay -->
      <div class="gallery-upload-overlay" id="gallery-upload-overlay" aria-hidden="true">
        <div class="gallery-upload-card">
          <div class="upload-card-header">
            <h2 class="upload-card-title">Nuevo recuerdo</h2>
            <button class="upload-card-close" id="upload-card-close" type="button" aria-label="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form class="upload-form" id="gallery-upload-form">
            <!-- Dropzone / File Picker -->
            <div class="upload-dropzone" id="upload-dropzone">
              <input type="file" id="upload-file-input" accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/webm,video/quicktime" style="display: none;" />
              
              <div class="dropzone-idle" id="dropzone-idle">
                <div class="dropzone-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <p class="dropzone-label">Seleccionar fotografía o video</p>
                <span class="dropzone-hint">o arrastra el archivo aquí (JPG, PNG, WebP, MP4, WebM)</span>
              </div>

              <!-- Preview Zone -->
              <div class="dropzone-preview" id="dropzone-preview" style="display: none;">
                <div class="preview-media-container" id="preview-media-container"></div>
                <button class="preview-change-btn" id="preview-change-btn" type="button">Cambiar archivo</button>
              </div>
            </div>

            <!-- Metadata inputs -->
            <div class="upload-field-group">
              <label class="upload-label" for="upload-title-input">Título (opcional)</label>
              <input class="upload-input" type="text" id="upload-title-input" placeholder="Ej. Una tarde especial..." maxlength="80" />
            </div>

            <div class="upload-field-group">
              <div class="upload-label-row">
                <label class="upload-label" for="upload-date-input">Fecha (opcional)</label>
                <button class="date-today-shortcut" id="btn-set-today" type="button" title="Usar fecha actual">Hoy</button>
              </div>
              <div class="date-input-wrapper" id="date-input-wrapper">
                <input class="upload-input upload-date-input" type="date" id="upload-date-input" />
                <button class="date-picker-icon-btn" id="btn-trigger-picker" type="button" aria-label="Abrir calendario">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="upload-field-group">
              <label class="upload-label" for="upload-desc-input">Descripción (opcional)</label>
              <textarea class="upload-textarea" id="upload-desc-input" rows="3" placeholder="Escribe una pequeña nota o dedicatoria..." maxlength="300"></textarea>
            </div>

            <!-- Upload Progress bar -->
            <div class="upload-progress-bar" id="upload-progress-bar" style="display: none;">
              <div class="upload-progress-fill" id="upload-progress-fill" style="width: 0%;"></div>
              <span class="upload-progress-status" id="upload-progress-status">Preparando...</span>
            </div>

            <!-- Form Actions -->
            <div class="upload-form-actions">
              <button class="btn-cancel" id="upload-cancel-btn" type="button">Cancelar</button>
              <button class="btn-submit-memory" id="upload-submit-btn" type="submit">
                <span>Guardar recuerdo</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lightbox Media Viewer -->
      <div class="gallery-lightbox" id="gallery-lightbox" aria-hidden="true">
        <button class="lightbox-close-btn" id="lightbox-close-btn" type="button" aria-label="Cerrar visor">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button class="lightbox-nav-btn prev-btn" id="lightbox-prev-btn" type="button" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button class="lightbox-nav-btn next-btn" id="lightbox-next-btn" type="button" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div class="lightbox-content-wrapper">
          <div class="lightbox-media-stage" id="lightbox-media-stage">
            <!-- Fullsize Image or Video Player -->
          </div>

          <div class="lightbox-info-pane" id="lightbox-info-pane">
            <div class="lightbox-meta-top">
              <span class="lightbox-date" id="lightbox-date"></span>
              <span class="lightbox-counter" id="lightbox-counter"></span>
            </div>
            <h3 class="lightbox-title" id="lightbox-title"></h3>
            <p class="lightbox-desc" id="lightbox-desc"></p>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    this.initEventListeners();
  }

  initEventListeners() {
    // Top close button
    const closeBtn = this.element.querySelector('#gallery-close-btn');
    closeBtn.addEventListener('click', () => this.close());

    // Upload triggers
    const openUploadBtn = this.element.querySelector('#gallery-open-upload-btn');
    openUploadBtn.addEventListener('click', () => this.openUploadModal());

    const uploadCloseBtn = this.element.querySelector('#upload-card-close');
    const uploadCancelBtn = this.element.querySelector('#upload-cancel-btn');
    uploadCloseBtn.addEventListener('click', () => this.closeUploadModal());
    uploadCancelBtn.addEventListener('click', () => this.closeUploadModal());

    // File selection / drag & drop
    const dropzone = this.element.querySelector('#upload-dropzone');
    const fileInput = this.element.querySelector('#upload-file-input');
    const previewChangeBtn = this.element.querySelector('#preview-change-btn');

    dropzone.addEventListener('click', (e) => {
      if (e.target !== previewChangeBtn && !this.selectedFile) {
        fileInput.click();
      }
    });

    previewChangeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleFileSelection(file);
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('is-dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      const file = e.dataTransfer.files?.[0];
      if (file) this.handleFileSelection(file);
    });

    // Date picker real-time triggers
    const dateInput = this.element.querySelector('#upload-date-input');
    const triggerPickerBtn = this.element.querySelector('#btn-trigger-picker');
    const setTodayBtn = this.element.querySelector('#btn-set-today');

    const openNativeCalendar = () => {
      if (dateInput && typeof dateInput.showPicker === 'function') {
        try {
          dateInput.showPicker();
        } catch (err) {
          dateInput.focus();
        }
      } else if (dateInput) {
        dateInput.focus();
      }
    };

    if (dateInput) {
      dateInput.addEventListener('click', () => openNativeCalendar());
    }

    if (triggerPickerBtn) {
      triggerPickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openNativeCalendar();
      });
    }

    if (setTodayBtn) {
      setTodayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (dateInput) {
          dateInput.value = this.getLocalDateString();
        }
      });
    }

    // Form submit
    const uploadForm = this.element.querySelector('#gallery-upload-form');
    uploadForm.addEventListener('submit', (e) => this.handleUploadSubmit(e));

    // Lightbox navigation
    const lightboxClose = this.element.querySelector('#lightbox-close-btn');
    const lightboxPrev = this.element.querySelector('#lightbox-prev-btn');
    const lightboxNext = this.element.querySelector('#lightbox-next-btn');
    const lightbox = this.element.querySelector('#gallery-lightbox');

    lightboxClose.addEventListener('click', () => this.closeLightbox());
    lightboxPrev.addEventListener('click', () => this.navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => this.navigateLightbox(1));

    // Lightbox touch swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      if (this.activeViewerIndex === -1 || e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (this.activeViewerIndex === -1 || e.changedTouches.length !== 1) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Check if horizontal swipe was dominant and > 45px
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        if (diffX < 0) {
          this.navigateLightbox(1); // Swipe left -> Next
        } else {
          this.navigateLightbox(-1); // Swipe right -> Previous
        }
      }
    }, { passive: true });

    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (this.activeViewerIndex !== -1) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
        if (e.key === 'ArrowRight') this.navigateLightbox(1);
        return;
      }

      if (this.isUploadOpen) {
        if (e.key === 'Escape') this.closeUploadModal();
        return;
      }

      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  async loadMemories() {
    this.isLoading = true;
    this.renderLoadingState();

    try {
      this.memories = await fetchMemories();
    } catch (error) {
      console.error('[GalleryModal] Failed to load memories:', error);
      this.memories = [];
    }

    this.isLoading = false;
    this.renderGalleryGrid();
  }

  renderLoadingState() {
    const body = this.element.querySelector('#gallery-body-content');
    body.innerHTML = `
      <div class="gallery-loading-state">
        <div class="gallery-spinner" aria-hidden="true"></div>
        <p class="loading-label">Cargando recuerdos...</p>
      </div>
    `;
  }

  renderGalleryGrid() {
    const body = this.element.querySelector('#gallery-body-content');

    if (!this.memories || this.memories.length === 0) {
      // Clean, romantic empty state
      body.innerHTML = `
        <div class="gallery-empty-state">
          <div class="empty-state-flourish" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(247, 184, 198, 0.4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <h2 class="empty-state-title">Galería de momentos</h2>
          <p class="empty-state-subtitle">“Todo álbum comienza antes de tener su primera fotografía.”</p>
          <p class="empty-state-desc" style="font-family: var(--font-serif); font-style: italic; font-size: 1.05rem; color: rgba(255, 230, 238, 0.7); margin-top: -16px; margin-bottom: 24px;">“Por ahora, este espacio simplemente espera.”</p>
          <button class="gallery-empty-btn" id="empty-add-memory-btn" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Agregar un recuerdo</span>
          </button>
        </div>
      `;

      const emptyBtn = body.querySelector('#empty-add-memory-btn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => this.openUploadModal());
      }
      return;
    }

    // Masonry grid of photos and videos
    const itemsHtml = this.memories.map((m, index) => {
      const isVideo = m.type === 'video';
      const hasMeta = m.title || m.memory_date;

      return `
        <article class="masonry-item ${isVideo ? 'is-video' : 'is-photo'}" data-index="${index}" tabindex="0" role="button" aria-label="${m.title || 'Ver recuerdo'}">
          <div class="masonry-media-wrap">
            <img class="masonry-thumb" src="${m.thumbnail_url || m.media_url}" alt="${m.title || 'Recuerdo'}" loading="lazy" />
            
            ${isVideo ? `
              <div class="video-play-badge" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              </div>
            ` : ''}

            ${hasMeta ? `
              <div class="masonry-overlay">
                ${m.memory_date ? `<span class="overlay-date">${m.memory_date}</span>` : ''}
                ${m.title ? `<h4 class="overlay-title">${m.title}</h4>` : ''}
              </div>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    body.innerHTML = `
      <div class="gallery-masonry-grid" id="gallery-masonry-grid">
        ${itemsHtml}
      </div>
    `;

    // Click handlers for masonry items
    const masonryItems = body.querySelectorAll('.masonry-item');
    masonryItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        this.openLightbox(index);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = parseInt(item.getAttribute('data-index'), 10);
          this.openLightbox(index);
        }
      });
    });
  }

  getLocalDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /* ---------------- Upload Modal Logic ---------------- */

  openUploadModal() {
    this.isUploadOpen = true;
    this.selectedFile = null;

    const overlay = this.element.querySelector('#gallery-upload-overlay');
    const form = this.element.querySelector('#gallery-upload-form');
    const idleZone = this.element.querySelector('#dropzone-idle');
    const previewZone = this.element.querySelector('#dropzone-preview');
    const previewMedia = this.element.querySelector('#preview-media-container');
    const progressBar = this.element.querySelector('#upload-progress-bar');
    const submitBtn = this.element.querySelector('#upload-submit-btn');

    form.reset();
    idleZone.style.display = 'flex';
    previewZone.style.display = 'none';
    previewMedia.innerHTML = '';
    progressBar.style.display = 'none';
    submitBtn.disabled = false;

    // Default today real-time local date
    const dateInput = this.element.querySelector('#upload-date-input');
    if (dateInput) {
      dateInput.value = this.getLocalDateString();
    }

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  closeUploadModal() {
    this.isUploadOpen = false;
    this.selectedFile = null;
    const overlay = this.element.querySelector('#gallery-upload-overlay');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  handleFileSelection(file) {
    if (!file) return;

    this.selectedFile = file;
    const idleZone = this.element.querySelector('#dropzone-idle');
    const previewZone = this.element.querySelector('#dropzone-preview');
    const previewMedia = this.element.querySelector('#preview-media-container');

    idleZone.style.display = 'none';
    previewZone.style.display = 'flex';

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      previewMedia.innerHTML = `
        <video class="preview-video-el" src="${url}" muted playsinline></video>
        <span class="preview-type-badge">Video</span>
      `;
    } else {
      previewMedia.innerHTML = `
        <img class="preview-img-el" src="${url}" alt="Vista previa" />
        <span class="preview-type-badge">Fotografía</span>
      `;
    }
  }

  async handleUploadSubmit(e) {
    e.preventDefault();
    if (!this.selectedFile) {
      alert('Por favor selecciona una fotografía o video.');
      return;
    }

    const titleInput = this.element.querySelector('#upload-title-input');
    const dateInput = this.element.querySelector('#upload-date-input');
    const descInput = this.element.querySelector('#upload-desc-input');
    const progressBar = this.element.querySelector('#upload-progress-bar');
    const progressFill = this.element.querySelector('#upload-progress-fill');
    const progressStatus = this.element.querySelector('#upload-progress-status');
    const submitBtn = this.element.querySelector('#upload-submit-btn');

    progressBar.style.display = 'block';
    submitBtn.disabled = true;

    try {
      await uploadMemory({
        file: this.selectedFile,
        title: titleInput.value,
        memory_date: dateInput.value,
        description: descInput.value,
        onProgress: ({ progress, message }) => {
          progressFill.style.width = `${progress}%`;
          progressStatus.textContent = message;
        }
      });

      // Reload gallery smoothly
      await this.loadMemories();
      this.closeUploadModal();
    } catch (error) {
      console.error('[GalleryModal] Upload failed:', error);
      alert(`Error al guardar recuerdo: ${error.message}`);
      submitBtn.disabled = false;
      progressBar.style.display = 'none';
    }
  }

  /* ---------------- Lightbox Media Viewer Logic ---------------- */

  openLightbox(index) {
    if (index < 0 || index >= this.memories.length) return;

    this.activeViewerIndex = index;
    const lightbox = this.element.querySelector('#gallery-lightbox');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    this.updateLightboxContent();
  }

  closeLightbox() {
    this.activeViewerIndex = -1;
    const lightbox = this.element.querySelector('#gallery-lightbox');
    const stage = this.element.querySelector('#lightbox-media-stage');

    // Pause any playing video
    const video = stage.querySelector('video');
    if (video) video.pause();

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    stage.innerHTML = '';
  }

  navigateLightbox(direction) {
    if (this.activeViewerIndex === -1) return;

    const nextIndex = this.activeViewerIndex + direction;
    if (nextIndex >= 0 && nextIndex < this.memories.length) {
      this.activeViewerIndex = nextIndex;
      this.updateLightboxContent();
    }
  }

  updateLightboxContent() {
    const memory = this.memories[this.activeViewerIndex];
    if (!memory) return;

    const stage = this.element.querySelector('#lightbox-media-stage');
    const dateEl = this.element.querySelector('#lightbox-date');
    const counterEl = this.element.querySelector('#lightbox-counter');
    const titleEl = this.element.querySelector('#lightbox-title');
    const descEl = this.element.querySelector('#lightbox-desc');
    const prevBtn = this.element.querySelector('#lightbox-prev-btn');
    const nextBtn = this.element.querySelector('#lightbox-next-btn');

    // Stop previous video
    const oldVideo = stage.querySelector('video');
    if (oldVideo) oldVideo.pause();

    // Render media
    if (memory.type === 'video') {
      stage.innerHTML = `
        <video class="lightbox-video" src="${memory.media_url}" poster="${memory.thumbnail_url}" controls preload="metadata" playsinline></video>
      `;
    } else {
      stage.innerHTML = `
        <img class="lightbox-image" src="${memory.media_url}" alt="${memory.title || 'Recuerdo'}" />
      `;
    }

    dateEl.textContent = memory.memory_date || '';
    counterEl.textContent = `${this.activeViewerIndex + 1} de ${this.memories.length}`;
    titleEl.textContent = memory.title || '';
    descEl.textContent = memory.description || '';

    titleEl.style.display = memory.title ? 'block' : 'none';
    descEl.style.display = memory.description ? 'block' : 'none';

    prevBtn.style.visibility = this.activeViewerIndex > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility = this.activeViewerIndex < this.memories.length - 1 ? 'visible' : 'hidden';
  }

  open() {
    this.isOpen = true;
    this.element.classList.add('is-open');
    this.loadMemories();
  }

  close() {
    this.isOpen = false;
    this.closeLightbox();
    this.closeUploadModal();
    this.element.classList.remove('is-open');
    if (this.onClose) this.onClose();
  }
}

