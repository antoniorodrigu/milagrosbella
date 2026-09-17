import * as THREE from 'three';

export class InteractionManager {
  constructor(camera, canvas, interactiveObjects, onSelectCallback) {
    this.camera = camera;
    this.canvas = canvas;
    this.interactiveObjects = interactiveObjects;
    this.onSelectCallback = onSelectCallback;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.pointerDownX = 0;
    this.pointerDownY = 0;
    this.pointerDownTime = 0;
    this.currentCursor = 'grab';

    // Decoupled pointer state (0ms event handling)
    this.pointerX = 0;
    this.pointerY = 0;
    this.pointerDirty = false;
    this.lastHoverCheckTime = 0;

    // Reusable projection vector
    this.tempVec = new THREE.Vector3();

    this.initEventListeners();
  }

  setInteractiveObjects(objects) {
    this.interactiveObjects = objects;
  }

  initEventListeners() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.pointerDownX = e.clientX;
      this.pointerDownY = e.clientY;
      this.pointerDownTime = performance.now();
    }, { passive: true });

    this.canvas.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - this.pointerDownX, e.clientY - this.pointerDownY);
      const elapsed = performance.now() - this.pointerDownTime;

      // Forgiving touch tap threshold for mobile fingertips (dist < 14px, elapsed < 450ms)
      if (dist < 14 && elapsed < 450) {
        this.handleClick(e.clientX, e.clientY);
      }
    }, { passive: true });

    // ONLY record latest pointer position on mouse devices
    window.addEventListener('pointermove', (e) => {
      // Skip pointermove processing on touch screens without fine pointer/hover
      if (e.pointerType === 'touch' || window.matchMedia('(hover: none)').matches) return;
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;
      this.pointerDirty = true;
    }, { passive: true });
  }

  handleClick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // Raycast directly against explicit hitboxes (non-recursive for instant performance)
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, false);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData?.type && obj.parent) {
        obj = obj.parent;
      }

      if (obj && obj.userData && obj.userData.type) {
        if (this.onSelectCallback) {
          this.onSelectCallback(obj.userData, intersects[0].point);
        }
      }
    }
  }

  update(delta) {
    if (!this.pointerDirty || window.matchMedia('(hover: none)').matches) return;

    const now = performance.now();
    // Throttle hover checks to max 25-30 times per second (~35ms)
    if (now - this.lastHoverCheckTime < 35) return;
    this.lastHoverCheckTime = now;
    this.pointerDirty = false;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((this.pointerX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((this.pointerY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, false);

    const desiredCursor = intersects.length > 0 ? 'pointer' : 'grab';
    if (this.currentCursor !== desiredCursor) {
      this.currentCursor = desiredCursor;
      this.canvas.style.cursor = desiredCursor;
    }
  }

  projectToScreen(position3D) {
    this.tempVec.set(position3D.x, position3D.y, position3D.z);
    this.tempVec.project(this.camera);

    const isBehind = this.tempVec.z > 1;
    const x = (this.tempVec.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(this.tempVec.y * 0.5) + 0.5) * window.innerHeight;

    return { x, y, isVisible: !isBehind && this.tempVec.z < 1 };
  }
}
