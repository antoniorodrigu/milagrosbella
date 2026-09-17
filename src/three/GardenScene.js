import * as THREE from 'three';

export class GardenScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // High performance, physical renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true
    });
    this.renderer.setSize(this.width, this.height);
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const maxDpr = isMobile ? 1.0 : 1.25;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35; // Bright, warm, inviting exposure
    
    // Shadows: Single-pass baking (autoUpdate = false) for massive GPU frame rate boost
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;

    // Romantic nocturnal twilight background & fog
    this.scene = new THREE.Scene();
    // Soft velvet twilight sky with deep rose-wine and dark indigo undertones
    this.scene.background = new THREE.Color(0x180f1b);
    this.scene.fog = new THREE.FogExp2(0x1a101e, 0.038);

    // Camera (45° natural human eye FOV)
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 70);
    this.camera.position.set(0, 1.8, 4.5);

    this.setupLighting();

    this.clock = new THREE.Clock();
    this.updatables = [];
    this.isReady = false;

    // Real-time FPS & Draw call telemetry
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  setupLighting() {
    // Warm romantic ambient base
    const ambientLight = new THREE.AmbientLight(0x3d2438, 1.8);
    this.scene.add(ambientLight);

    // Soft sky/ground hemisphere light (Warm blush sky / Velvet burgundy ground)
    const hemiLight = new THREE.HemisphereLight(0x4a2a3e, 0x1f141e, 1.4);
    hemiLight.position.set(0, 18, 0);
    this.scene.add(hemiLight);

    // Main romantic moonlight (Warm champagne rose key light)
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const shadowRes = isMobile ? 512 : 1024;

    const moonLight = new THREE.DirectionalLight(0xf5d8e2, 1.6);
    moonLight.position.set(6, 12, 5);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = shadowRes;
    moonLight.shadow.mapSize.height = shadowRes;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 24;
    moonLight.shadow.camera.left = -9;
    moonLight.shadow.camera.right = 9;
    moonLight.shadow.camera.top = 9;
    moonLight.shadow.camera.bottom = -9;
    moonLight.shadow.bias = -0.0003;
    moonLight.shadow.radius = isMobile ? 1.5 : 2.0;
    this.scene.add(moonLight);

    // Warm golden rim backlight for soft botanical silhouettes
    const backLight = new THREE.DirectionalLight(0xffbe76, 0.85);
    backLight.position.set(-6, 7, -6);
    this.scene.add(backLight);

    // Subtle soft fill light from the front
    const frontFill = new THREE.DirectionalLight(0xd98b9d, 0.6);
    frontFill.position.set(0, 4, 8);
    this.scene.add(frontFill);
  }

  precompile() {
    if (this.renderer && this.scene && this.camera) {
      // Trigger shadow map render pass once
      this.renderer.shadowMap.needsUpdate = true;
      // Pre-compile all materials, shadow maps, and GLSL programs in advance
      this.renderer.compile(this.scene, this.camera);
      // Perform initial frame render to warm GPU pipeline completely
      this.renderer.render(this.scene, this.camera);
      this.isReady = true;
    }
  }

  requestShadowUpdate() {
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  addUpdatable(object) {
    this.updatables.push(object);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);

    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const maxDpr = isMobile ? 1.0 : 1.25;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    this.requestShadowUpdate();
  }

  render() {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    for (let i = 0; i < this.updatables.length; i++) {
      const item = this.updatables[i];
      if (item && typeof item.update === 'function') {
        item.update(delta, elapsedTime);
      }
    }

    this.renderer.render(this.scene, this.camera);

    // Track FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
