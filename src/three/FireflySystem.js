import * as THREE from 'three';

export class FireflySystem {
  constructor(scene, count = 28) {
    this.scene = scene;
    this.count = count;
    this.motes = [];

    this.init();
  }

  init() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 5.8;
      const x = Math.cos(angle) * radius;
      const y = 0.4 + Math.random() * 2.2;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.motes.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: 0.18 + Math.random() * 0.25,
        speedY: 0.22 + Math.random() * 0.3,
        speedZ: 0.18 + Math.random() * 0.25,
        ampX: 0.4 + Math.random() * 0.4,
        ampY: 0.3 + Math.random() * 0.3,
        ampZ: 0.4 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Warm golden-rose soft radial particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 235, 205, 1)');
    grad.addColorStop(0.35, 'rgba(255, 185, 195, 0.7)');
    grad.addColorStop(0.7, 'rgba(235, 130, 150, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    this.material = new THREE.PointsMaterial({
      size: 0.34,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffdfd0,
      opacity: 0.75
    });

    this.particleSystem = new THREE.Points(geo, this.material);
    this.scene.add(this.particleSystem);
  }

  update(delta, elapsedTime) {
    if (!this.particleSystem) return;

    const positions = this.particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < this.count; i++) {
      const m = this.motes[i];
      const t = elapsedTime * 0.5 + m.phase;

      positions[i * 3] = m.baseX + Math.sin(t * m.speedX) * m.ampX;
      positions[i * 3 + 1] = m.baseY + Math.sin(t * m.speedY) * m.ampY;
      positions[i * 3 + 2] = m.baseZ + Math.cos(t * m.speedZ) * m.ampZ;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.material.opacity = 0.65 + Math.sin(elapsedTime * 1.8) * 0.25;
  }
}
