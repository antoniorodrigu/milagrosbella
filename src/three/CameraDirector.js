import * as THREE from 'three';
import gsap from 'gsap';

export class CameraDirector {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;

    // Camera target vector
    this.target = new THREE.Vector3(0, 0.65, -1.2);
    this.currentLookAt = new THREE.Vector3(0, 0.65, -1.2);

    // Orbit state
    this.isUserInteracting = false;
    this.isCinematicPlaying = false;
    this.spherical = new THREE.Spherical(4.2, Math.PI / 2.8, 0);
    this.targetSpherical = new THREE.Spherical(4.2, Math.PI / 2.8, 0);

    // Drag / Touch tracking
    this.pointerDown = false;
    this.startX = 0;
    this.startY = 0;
    this.previousTouchDist = 0;

    // Limits
    this.minDistance = 1.8;
    this.maxDistance = 8.0;
    this.minPolarAngle = Math.PI / 6;
    this.maxPolarAngle = Math.PI / 2.15;

    // Reusable math vectors (Zero GC allocations in render loop)
    this.tempOffset = new THREE.Vector3();
    this.tempTargetPos = new THREE.Vector3();
    this.tempCamPos = new THREE.Vector3();
    this.tempCamOffset = new THREE.Vector3();

    this.initEventListeners();
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.isCinematicPlaying) return;
      this.pointerDown = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.pointerDown || this.isCinematicPlaying) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.startX = e.clientX;
      this.startY = e.clientY;

      // Snappy, agile orbit response
      this.targetSpherical.theta -= dx * 0.0065;
      this.targetSpherical.phi = Math.max(
        this.minPolarAngle,
        Math.min(this.maxPolarAngle, this.targetSpherical.phi - dy * 0.0065)
      );
    });

    window.addEventListener('mouseup', () => {
      this.pointerDown = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      if (this.isCinematicPlaying) return;
      e.preventDefault();
      this.targetSpherical.radius = Math.max(
        this.minDistance,
        Math.min(this.maxDistance, this.targetSpherical.radius + e.deltaY * 0.0035)
      );
    }, { passive: false });

    this.canvas.addEventListener('touchstart', (e) => {
      if (this.isCinematicPlaying) return;
      if (e.touches.length === 1) {
        this.pointerDown = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        this.pointerDown = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.previousTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isCinematicPlaying) return;
      if (e.touches.length === 1 && this.pointerDown) {
        const dx = e.touches[0].clientX - this.startX;
        const dy = e.touches[0].clientY - this.startY;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;

        this.targetSpherical.theta -= dx * 0.0075;
        this.targetSpherical.phi = Math.max(
          this.minPolarAngle,
          Math.min(this.maxPolarAngle, this.targetSpherical.phi - dy * 0.0075)
        );
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = this.previousTouchDist - dist;
        this.previousTouchDist = dist;

        this.targetSpherical.radius = Math.max(
          this.minDistance,
          Math.min(this.maxDistance, this.targetSpherical.radius + delta * 0.015)
        );
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.pointerDown = false;
    });

    window.addEventListener('touchcancel', () => {
      this.pointerDown = false;
    });
  }

  startInitialCinematicTour(onSubtitlesCallback, onCompleteCallback) {
    this.isCinematicPlaying = true;

    // Start smoothly at comfortable vantage point
    this.camera.position.set(0, 1.6, 2.8);
    this.target.set(0, 0.65, -1.2);
    this.currentLookAt.copy(this.target);
    this.camera.lookAt(this.currentLookAt);

    if (onSubtitlesCallback) onSubtitlesCallback();

    // Fast, responsive, elegant camera glide straight to the signature flower (~1.2s)
    gsap.to(this.camera.position, {
      x: 0.35,
      y: 0.95,
      z: 0.5,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        this.camera.lookAt(this.target);
      },
      onComplete: () => {
        this.isCinematicPlaying = false;
        this.tempOffset.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tempOffset);
        this.targetSpherical.copy(this.spherical);
        if (onCompleteCallback) onCompleteCallback();
      }
    });
  }

  focusOn(position, targetRadius = 2.8, duration = 1.0, onComplete) {
    if (this.isCinematicPlaying) return;

    gsap.killTweensOf(this.target);
    gsap.killTweensOf(this.camera.position);

    this.tempTargetPos.set(position.x, position.y + 0.3, position.z);
    this.tempCamOffset.set(0.5, 0.8, 1.6).normalize().multiplyScalar(targetRadius);
    this.tempCamPos.addVectors(this.tempTargetPos, this.tempCamOffset);

    gsap.to(this.target, {
      x: this.tempTargetPos.x,
      y: this.tempTargetPos.y,
      z: this.tempTargetPos.z,
      duration: duration,
      ease: 'power2.out'
    });

    gsap.to(this.camera.position, {
      x: this.tempCamPos.x,
      y: this.tempCamPos.y,
      z: this.tempCamPos.z,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.tempOffset.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tempOffset);
        this.targetSpherical.copy(this.spherical);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  update(delta) {
    if (this.isCinematicPlaying) {
      this.currentLookAt.lerp(this.target, 0.22);
      this.camera.lookAt(this.currentLookAt);
      return;
    }

    // High responsiveness damping (~0.25) for immediate feel without sluggishness
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.24;
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.26;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.26;

    this.tempOffset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(this.tempOffset);

    this.currentLookAt.lerp(this.target, 0.24);
    this.camera.lookAt(this.currentLookAt);
  }
}
