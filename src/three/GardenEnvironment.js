import * as THREE from 'three';
import { gardenData } from '../data/milagros.js';

export class GardenEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.interactiveObjects = [];
    this.waterMesh = null;
    this.waterLily = null;
    this.surpriseLight = null;
    this.surpriseBulb = null;

    this.init();
  }

  init() {
    this.createTerrain();
    this.createCobblestonePath();
    this.createBench();
    this.createFountain();
    this.createLanterns();
    this.createSurpriseLamp();
    this.createSecretPathArch();
    this.createPerimeterFoliage();
  }

  createTerrain() {
    // Sculpted organic terrain in warm velvet twilight tones
    const groundGeo = new THREE.PlaneGeometry(36, 36, 44, 44);
    groundGeo.rotateX(-Math.PI / 2);

    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      const elevation = Math.sin(x * 0.22) * Math.cos(z * 0.22) * 0.14 + (dist > 8 ? (dist - 8) * 0.12 : 0);
      pos.setY(i, elevation);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1520, // Warm deep twilight velvet moss
      roughness: 0.82,
      metalness: 0.08
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createCobblestonePath() {
    const pathGroup = new THREE.Group();

    // Warm sandstone / champagne flagstones that reflect soft warm moonlight
    const stones = [
      // Main central path
      { x: 0, z: 4.2, r: 0.38 },
      { x: 0.08, z: 3.5, r: 0.4 },
      { x: -0.12, z: 2.8, r: 0.44 },
      { x: 0.05, z: 2.1, r: 0.45 },
      { x: -0.06, z: 1.4, r: 0.46 },
      { x: 0, z: 0.7, r: 0.48 },
      { x: -0.04, z: 0.0, r: 0.5 },
      { x: 0, z: -0.7, r: 0.5 },
      { x: 0, z: -1.4, r: 0.48 },
      // Towards the bench
      { x: 0.65, z: -0.9, r: 0.34 },
      { x: 1.35, z: -1.1, r: 0.36 },
      { x: 2.05, z: -1.3, r: 0.38 },
      { x: 2.7, z: -1.5, r: 0.4 },
      // Towards the fountain
      { x: -0.65, z: -0.8, r: 0.34 },
      { x: -1.35, z: -1.0, r: 0.36 },
      { x: -2.1, z: -1.2, r: 0.38 },
      { x: -2.8, z: -1.3, r: 0.4 },
      // Path extending towards the arbor arch
      { x: 0.2, z: -2.3, r: 0.38 },
      { x: 0.5, z: -3.4, r: 0.36 },
      { x: 0.8, z: -4.6, r: 0.35 },
      { x: 1.2, z: -5.8, r: 0.34 },
      { x: 1.5, z: -7.0, r: 0.33 }
    ];

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x3d303a, // Warm illuminated sandstone slate
      roughness: 0.7,
      metalness: 0.12
    });

    stones.forEach(st => {
      const geo = new THREE.CylinderGeometry(st.r, st.r * 1.05, 0.05, 8);
      const stone = new THREE.Mesh(geo, stoneMat);
      stone.position.set(st.x + (Math.random() - 0.5) * 0.06, 0.025, st.z + (Math.random() - 0.5) * 0.06);
      stone.rotation.y = Math.random() * Math.PI;
      stone.scale.set(1 + (Math.random() - 0.5) * 0.15, 1, 1 + (Math.random() - 0.5) * 0.15);
      stone.receiveShadow = true;
      pathGroup.add(stone);
    });

    this.scene.add(pathGroup);
  }

  createBench() {
    const benchGroup = new THREE.Group();
    benchGroup.name = 'bench';
    benchGroup.userData = {
      type: 'bench',
      id: 'bench',
      title: gardenData.bench.title
    };

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x422018, // Warm rich mahogany
      roughness: 0.6,
      metalness: 0.08
    });

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x221a22, // Elegant dark wrought iron
      roughness: 0.4,
      metalness: 0.7
    });

    // Curved romantic iron legs & armrests
    const legGeo = new THREE.BoxGeometry(0.045, 0.46, 0.38);
    const legLeft = new THREE.Mesh(legGeo, ironMat);
    legLeft.position.set(-0.65, 0.23, 0);
    legLeft.castShadow = true;

    const legRight = new THREE.Mesh(legGeo, ironMat);
    legRight.position.set(0.65, 0.23, 0);
    legRight.castShadow = true;

    benchGroup.add(legLeft, legRight);

    // Seat slats
    const slatGeo = new THREE.BoxGeometry(1.45, 0.03, 0.095);
    for (let i = 0; i < 4; i++) {
      const slat = new THREE.Mesh(slatGeo, woodMat);
      slat.position.set(0, 0.44, -0.14 + i * 0.1);
      slat.castShadow = true;
      slat.receiveShadow = true;
      benchGroup.add(slat);
    }

    // Backrest slats with gentle tilt
    const backGeo = new THREE.BoxGeometry(1.45, 0.075, 0.025);
    for (let i = 0; i < 3; i++) {
      const back = new THREE.Mesh(backGeo, woodMat);
      back.position.set(0, 0.58 + i * 0.095, -0.19);
      back.rotation.x = -0.12;
      back.castShadow = true;
      benchGroup.add(back);
    }

    // Warm glow above the bench
    const benchGlow = new THREE.PointLight(0xffdfb8, 0.9, 3.5, 2);
    benchGlow.position.set(0, 1.2, 0);
    benchGroup.add(benchGlow);

    // Hitbox
    const hitGeo = new THREE.BoxGeometry(1.9, 1.3, 1.3);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.set(0, 0.5, 0);
    hitbox.userData = benchGroup.userData;
    benchGroup.add(hitbox);

    benchGroup.position.set(gardenData.bench.position3D.x, 0, gardenData.bench.position3D.z);
    benchGroup.rotation.y = -Math.PI / 4.2;

    this.scene.add(benchGroup);
    this.interactiveObjects.push(hitbox);
  }

  createFountain() {
    const fountainGroup = new THREE.Group();
    fountainGroup.name = 'fountain';
    fountainGroup.userData = {
      type: 'fountain',
      id: 'fountain',
      title: gardenData.fountain.title
    };

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x382c36, // Warm stone rim
      roughness: 0.72,
      metalness: 0.1
    });

    // Circular stone rim
    const rimGeo = new THREE.TorusGeometry(1.2, 0.16, 14, 32);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, stoneMat);
    rim.position.y = 0.22;
    rim.castShadow = true;
    rim.receiveShadow = true;
    fountainGroup.add(rim);

    // Basin base
    const basinGeo = new THREE.CylinderGeometry(1.2, 1.05, 0.24, 32);
    const basin = new THREE.Mesh(basinGeo, stoneMat);
    basin.position.y = 0.12;
    basin.receiveShadow = true;
    fountainGroup.add(basin);

    // Crystalline reflective water surface
    const waterGeo = new THREE.CircleGeometry(1.16, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x184852, // Clear luminous turquoise/cyan-teal water
      roughness: 0.08,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.y = 0.23;
    fountainGroup.add(this.waterMesh);

    // Floating water lily lotus flower on the pond
    const lilyGroup = new THREE.Group();
    lilyGroup.position.set(0.3, 0.24, 0.2);

    const padMat = new THREE.MeshStandardMaterial({ color: 0x224832, roughness: 0.6 });
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.01, 16), padMat);
    lilyGroup.add(pad);

    const lilyPetalMat = new THREE.MeshStandardMaterial({ color: 0xf7b8cc, roughness: 0.35 });
    for (let p = 0; p < 6; p++) {
      const pAngle = (p / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 5), lilyPetalMat);
      petal.rotation.x = Math.PI / 2.6;
      petal.position.set(Math.cos(pAngle) * 0.05, 0.03, Math.sin(pAngle) * 0.05);
      petal.rotation.y = pAngle;
      lilyGroup.add(petal);
    }
    this.waterLily = lilyGroup;
    fountainGroup.add(lilyGroup);

    // Luminous pool light (warm turquoise-rose glow)
    const poolLight = new THREE.PointLight(0x7ed0e0, 1.2, 3.8);
    poolLight.position.set(0, 0.45, 0);
    fountainGroup.add(poolLight);

    const warmAccent = new THREE.PointLight(0xffd4de, 0.8, 3.0);
    warmAccent.position.set(0, 0.8, 0);
    fountainGroup.add(warmAccent);

    // Hitbox
    const hitGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.9, 16);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.y = 0.45;
    hitbox.userData = fountainGroup.userData;
    fountainGroup.add(hitbox);

    fountainGroup.position.set(gardenData.fountain.position3D.x, 0, gardenData.fountain.position3D.z);
    this.scene.add(fountainGroup);
    this.interactiveObjects.push(hitbox);
  }

  createLanterns() {
    // Beautiful romantic garden lamps lining the path
    const lanternPositions = [
      { x: -1.2, z: 1.8 },
      { x: 1.4, z: 0.6 },
      { x: 2.2, z: -2.7 },
      { x: -2.7, z: -2.8 }
    ];

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x241d24,
      roughness: 0.5,
      metalness: 0.65
    });

    const warmGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffe0a8,
      transparent: true,
      opacity: 0.92
    });

    lanternPositions.forEach(pos => {
      const group = new THREE.Group();

      // Slender post
      const postGeo = new THREE.CylinderGeometry(0.045, 0.06, 0.72, 8);
      const post = new THREE.Mesh(postGeo, metalMat);
      post.position.y = 0.36;
      post.castShadow = true;
      group.add(post);

      // Glass lamp housing
      const glassGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8);
      const glass = new THREE.Mesh(glassGeo, warmGlowMat);
      glass.position.y = 0.78;
      group.add(glass);

      // Cap
      const capGeo = new THREE.ConeGeometry(0.16, 0.1, 8);
      const cap = new THREE.Mesh(capGeo, metalMat);
      cap.position.y = 0.92;
      cap.castShadow = true;
      group.add(cap);

      // Warm golden point light
      const light = new THREE.PointLight(0xffbe6a, 1.1, 4.8, 2);
      light.position.set(0, 0.78, 0);
      group.add(light);

      group.position.set(pos.x, 0, pos.z);
      this.scene.add(group);
    });
  }

  createSurpriseLamp() {
    const lampGroup = new THREE.Group();
    lampGroup.name = 'surprise-lamp';
    lampGroup.userData = {
      type: 'surprise-lamp',
      id: 'surprise-lamp',
      title: gardenData.newDetailSurprise.title
    };

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x282028,
      roughness: 0.5,
      metalness: 0.7
    });

    const postGeo = new THREE.CylinderGeometry(0.045, 0.065, 1.35, 8);
    const post = new THREE.Mesh(postGeo, metalMat);
    post.position.y = 0.675;
    post.castShadow = true;
    lampGroup.add(post);

    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), metalMat);
    head.position.y = 1.38;
    lampGroup.add(head);

    const isLit = gardenData.newDetailSurprise.hasNewSurprise;
    const bulbGeo = new THREE.SphereGeometry(0.08, 12, 12);
    this.bulbMat = new THREE.MeshStandardMaterial({
      color: isLit ? 0xfff2cc : 0x5a4d52,
      emissive: isLit ? 0xffc66d : 0x221118,
      emissiveIntensity: isLit ? 1.5 : 0.3,
      roughness: 0.2
    });
    this.surpriseBulb = new THREE.Mesh(bulbGeo, this.bulbMat);
    this.surpriseBulb.position.y = 1.38;
    lampGroup.add(this.surpriseBulb);

    this.surpriseLight = new THREE.PointLight(0xffbe5c, isLit ? 1.4 : 0.4, 5.5, 2);
    this.surpriseLight.position.set(0, 1.38, 0);
    lampGroup.add(this.surpriseLight);

    const hitGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.y = 0.85;
    hitbox.userData = lampGroup.userData;
    lampGroup.add(hitbox);

    lampGroup.position.set(
      gardenData.newDetailSurprise.lampPosition3D.x,
      0,
      gardenData.newDetailSurprise.lampPosition3D.z
    );

    this.scene.add(lampGroup);
    this.interactiveObjects.push(hitbox);
  }

  createSecretPathArch() {
    const archGroup = new THREE.Group();
    archGroup.name = 'secret-path';
    archGroup.userData = {
      type: 'secret-path',
      id: 'secret-path',
      title: gardenData.secretPath.closedMessage.title
    };

    const archMat = new THREE.MeshStandardMaterial({
      color: 0x241a24,
      roughness: 0.7,
      metalness: 0.4
    });

    const leftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 2.1, 8), archMat);
    leftPillar.position.set(-0.8, 1.05, 0);
    const rightPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 2.1, 8), archMat);
    rightPillar.position.set(0.8, 1.05, 0);

    const curve = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.055, 8, 16, Math.PI), archMat);
    curve.position.set(0, 2.1, 0);

    archGroup.add(leftPillar, rightPillar, curve);

    // Decorative blooming roses on the arch
    const archFlowerMat = new THREE.MeshStandardMaterial({ color: 0xeb94aa, roughness: 0.35 });
    for (let f = 0; f < 7; f++) {
      const fAngle = (f / 6) * Math.PI;
      const fMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08, 0), archFlowerMat);
      fMesh.position.set(Math.cos(fAngle) * 0.82, 2.1 + Math.sin(fAngle) * 0.82, 0.02);
      archGroup.add(fMesh);
    }

    const archLight = new THREE.PointLight(0xd49cb0, 0.85, 5);
    archLight.position.set(0, 1.3, -0.3);
    archGroup.add(archLight);

    const hitGeo = new THREE.BoxGeometry(2.0, 2.4, 1.0);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.set(0, 1.2, 0);
    hitbox.userData = archGroup.userData;
    archGroup.add(hitbox);

    archGroup.position.set(
      gardenData.secretPath.position3D.x,
      0,
      gardenData.secretPath.position3D.z
    );

    this.scene.add(archGroup);
    this.interactiveObjects.push(hitbox);
  }

  createPerimeterFoliage() {
    const foliageGroup = new THREE.Group();
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e22,
      roughness: 0.85,
      metalness: 0.05
    });

    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 9.2 + (i % 3) * 1.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x22161b, roughness: 0.88 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 2.4, 6), trunkMat);
      trunk.position.y = 1.2;
      tree.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + (i % 2) * 0.35, 1), leafMat);
      crown.position.y = 2.6;
      crown.castShadow = true;
      tree.add(crown);

      tree.position.set(x, 0, z);
      tree.scale.setScalar(0.9 + (i % 2) * 0.3);
      foliageGroup.add(tree);
    }

    this.scene.add(foliageGroup);
  }

  update(delta, elapsedTime) {
    if (this.waterMesh) {
      this.waterMesh.rotation.z = elapsedTime * 0.04;
    }
    if (this.waterLily) {
      this.waterLily.rotation.y = Math.sin(elapsedTime * 0.8) * 0.1;
      this.waterLily.position.y = 0.24 + Math.sin(elapsedTime * 1.5) * 0.005;
    }
  }
}
