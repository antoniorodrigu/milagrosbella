import * as THREE from 'three';
import { gardenData } from '../data/milagros.js';

export class FloraSystem {
  constructor(scene) {
    this.scene = scene;
    this.interactiveObjects = [];
    this.animatedFlowers = [];
    this.flowerBushes = [];
    this.grassMeshes = [];

    this.init();
  }

  init() {
    this.createGardenFlowers();
    this.createRomanticFlowerBushes();
    this.createEmptyPlots();
    this.createBotanicalFoliage();
  }

  createGardenFlowers() {
    gardenData.flowers.forEach(flowerData => {
      const flowerObj = this.buildMasterpieceRose(flowerData);
      this.scene.add(flowerObj);
      this.animatedFlowers.push(flowerObj);
    });
  }

  buildMasterpieceRose(flowerData) {
    const group = new THREE.Group();
    group.name = flowerData.id;
    group.userData = {
      type: 'flower',
      id: flowerData.id,
      flowerData: flowerData,
      title: flowerData.title
    };

    const isPrimary = flowerData.isPrimary;

    // Rich physical botanical materials
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x22482e,
      roughness: 0.55,
      metalness: 0.08
    });

    const sepalMat = new THREE.MeshStandardMaterial({
      color: 0x2d5c3a,
      roughness: 0.5,
      metalness: 0.05
    });

    const petalMatOuter = new THREE.MeshStandardMaterial({
      color: 0xfdf2f5, // Soft ivory cream with delicate blush
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    const petalMatMid = new THREE.MeshStandardMaterial({
      color: 0xf2a6bb, // Romantic velvet blush rose
      roughness: 0.32,
      metalness: 0.06,
      side: THREE.DoubleSide
    });

    const petalMatInner = new THREE.MeshStandardMaterial({
      color: 0xd85675, // Rich crimson rose
      roughness: 0.3,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const petalMatCore = new THREE.MeshStandardMaterial({
      color: 0xa82442, // Deep velvety wine core
      roughness: 0.28,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const stamenMat = new THREE.MeshStandardMaterial({
      color: 0xf7d58b,
      emissive: 0xd4af37,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });

    // 1. Organic Curved Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.035, 0.25, 0.02),
      new THREE.Vector3(-0.025, 0.52, -0.015),
      new THREE.Vector3(0.01, 0.78, 0.01)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 28, 0.022, 10, false);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.castShadow = true;
    group.add(stem);

    // 2. Botanical Rose Leaves (Realistic serrated contour)
    const leafGeo = new THREE.SphereGeometry(0.12, 12, 8);
    leafGeo.scale(0.55, 0.05, 1.8);
    
    const leaf1 = new THREE.Mesh(leafGeo, stemMat);
    leaf1.position.set(0.06, 0.3, 0.05);
    leaf1.rotation.set(0.25, 0.65, 0.35);
    
    const leaf2 = new THREE.Mesh(leafGeo, stemMat);
    leaf2.position.set(-0.06, 0.48, -0.03);
    leaf2.rotation.set(-0.25, -0.85, -0.35);
    
    const leaf3 = new THREE.Mesh(leafGeo, stemMat);
    leaf3.position.set(0.04, 0.65, -0.04);
    leaf3.rotation.set(0.2, 0.4, 0.3);
    
    group.add(leaf1, leaf2, leaf3);

    // 3. Rose Calyx & Sepals at Flower Base
    const calyx = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), sepalMat);
    calyx.position.set(0.01, 0.77, 0.01);
    group.add(calyx);

    for (let s = 0; s < 5; s++) {
      const sAngle = (s / 5) * Math.PI * 2;
      const sepal = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 4), sepalMat);
      sepal.position.set(
        0.01 + Math.cos(sAngle) * 0.05,
        0.75,
        0.01 + Math.sin(sAngle) * 0.05
      );
      sepal.rotation.x = Math.PI / 1.5;
      sepal.rotation.y = sAngle;
      group.add(sepal);
    }

    // 4. Blooming Rose Blossom Head
    const blossomGroup = new THREE.Group();
    blossomGroup.position.set(0.01, 0.8, 0.01);
    blossomGroup.rotation.x = -0.15;

    // Golden center stamen
    const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), stamenMat);
    blossomGroup.add(stamen);

    // Helper: Create curved rose petal geometry
    const createPetalMesh = (width, height, curl, material) => {
      const geo = new THREE.CylinderGeometry(width * 0.3, width, height, 10, 2, true);
      geo.rotateX(curl);
      return new THREE.Mesh(geo, material);
    };

    // Layer 1: Spiral tightly curled core petals (Wine red)
    for (let c = 0; c < 5; c++) {
      const angle = (c / 5) * Math.PI * 2;
      const petal = createPetalMesh(0.07, 0.16, Math.PI / 2.7, petalMatCore);
      petal.position.set(Math.cos(angle) * 0.035, 0.02, Math.sin(angle) * 0.035);
      petal.rotation.y = angle + 0.45;
      blossomGroup.add(petal);
    }

    // Layer 2: Inner blooming petals (Crimson)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.3;
      const petal = createPetalMesh(0.1, 0.22, Math.PI / 2.4, petalMatInner);
      petal.position.set(Math.cos(angle) * 0.06, 0.03, Math.sin(angle) * 0.06);
      petal.rotation.y = angle;
      petal.castShadow = true;
      blossomGroup.add(petal);
    }

    // Layer 3: Mid blooming petals (Blush pink)
    for (let m = 0; m < 8; m++) {
      const angle = (m / 8) * Math.PI * 2 + 0.15;
      const petal = createPetalMesh(0.14, 0.28, Math.PI / 2.15, petalMatMid);
      petal.position.set(Math.cos(angle) * 0.085, 0.025, Math.sin(angle) * 0.085);
      petal.rotation.y = angle;
      petal.castShadow = true;
      blossomGroup.add(petal);
    }

    // Layer 4: Outer open petals (Cream blush)
    for (let o = 0; o < 9; o++) {
      const angle = (o / 9) * Math.PI * 2;
      const petal = createPetalMesh(0.18, 0.35, Math.PI / 1.95, petalMatOuter);
      petal.position.set(Math.cos(angle) * 0.11, 0.015, Math.sin(angle) * 0.11);
      petal.rotation.y = angle;
      petal.castShadow = true;
      blossomGroup.add(petal);
    }

    group.add(blossomGroup);

    // Spotlight, pedestal and fallen petals for the Signature Flower
    if (isPrimary) {
      const spotLight = new THREE.PointLight(0xffe2c4, 2.0, 4.5, 2);
      spotLight.position.set(0, 1.2, 0);
      group.add(spotLight);

      const subtleGlow = new THREE.PointLight(0xf29cb0, 1.3, 3.2, 2);
      subtleGlow.position.set(0, 0.65, 0);
      group.add(subtleGlow);

      // Clean marble/sandstone pedestal
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x362530,
        roughness: 0.7,
        metalness: 0.12
      });
      const pedGeo = new THREE.CylinderGeometry(0.4, 0.48, 0.08, 20);
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.y = 0.04;
      ped.receiveShadow = true;
      group.add(ped);

      // Scattered soft rose petals around the base
      const fallenPetalMat = new THREE.MeshStandardMaterial({
        color: 0xf4b5c6,
        roughness: 0.4,
        side: THREE.DoubleSide
      });
      for (let p = 0; p < 14; p++) {
        const pGeo = new THREE.PlaneGeometry(0.065, 0.095);
        pGeo.rotateX(-Math.PI / 2);
        const fPetal = new THREE.Mesh(pGeo, fallenPetalMat);
        const pAngle = Math.random() * Math.PI * 2;
        const pDist = 0.18 + Math.random() * 0.48;
        fPetal.position.set(Math.cos(pAngle) * pDist, 0.082, Math.sin(pAngle) * pDist);
        fPetal.rotation.y = Math.random() * Math.PI;
        fPetal.rotation.z = (Math.random() - 0.5) * 0.25;
        group.add(fPetal);
      }
    }

    // Interactive Hitbox
    const hitGeo = new THREE.SphereGeometry(0.65, 10, 10);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.set(0, 0.5, 0);
    hitbox.userData = group.userData;
    group.add(hitbox);

    group.position.set(
      flowerData.position3D.x,
      0,
      flowerData.position3D.z
    );

    this.interactiveObjects.push(hitbox);
    return group;
  }

  createRomanticFlowerBushes() {
    const bushPositions = [
      { x: -1.2, z: 2.4, color: 0xeb9bb0, size: 0.75 },
      { x: 1.1, z: 2.2, color: 0xf5d0dc, size: 0.7 },
      { x: -1.8, z: 0.6, color: 0xe58298, size: 0.85 },
      { x: 1.8, z: 0.2, color: 0xf2b6c6, size: 0.8 },
      { x: 2.4, z: -1.0, color: 0xf9e0e6, size: 0.85 },
      { x: -2.6, z: -0.6, color: 0xdf7a92, size: 0.8 },
      { x: -1.0, z: -2.8, color: 0xf1aebd, size: 0.9 },
      { x: 1.4, z: -3.0, color: 0xf7d5de, size: 0.85 },
      { x: -0.4, z: -4.2, color: 0xe0728c, size: 0.95 },
      { x: 2.2, z: -5.2, color: 0xf4c2ce, size: 0.9 }
    ];

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x223d2b,
      roughness: 0.75,
      metalness: 0.05
    });

    bushPositions.forEach(b => {
      const bushGroup = new THREE.Group();

      const foliage = new THREE.Mesh(
        new THREE.DodecahedronGeometry(b.size * 0.55, 1),
        leafMat
      );
      foliage.position.y = b.size * 0.4;
      foliage.scale.set(1.2, 0.85, 1.1);
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      bushGroup.add(foliage);

      const flowerMat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.35,
        metalness: 0.08
      });

      const clusterCount = 5;
      for (let i = 0; i < clusterCount; i++) {
        const angle = (i / clusterCount) * Math.PI * 2;
        const blossom = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.12 * b.size, 0),
          flowerMat
        );
        blossom.position.set(
          Math.cos(angle) * (b.size * 0.38),
          b.size * 0.45 + (Math.random() - 0.5) * 0.1,
          Math.sin(angle) * (b.size * 0.38)
        );
        bushGroup.add(blossom);
      }

      bushGroup.position.set(b.x, 0, b.z);
      this.scene.add(bushGroup);
      this.flowerBushes.push(bushGroup);
    });
  }

  createEmptyPlots() {
    gardenData.emptyPlots.forEach(plotData => {
      const plotGroup = new THREE.Group();
      plotGroup.name = plotData.id;
      plotGroup.userData = {
        type: 'empty-plot',
        id: plotData.id,
        plotData: plotData,
        title: 'Un espacio por florecer'
      };

      const moundMat = new THREE.MeshStandardMaterial({
        color: 0x2b1e28,
        roughness: 0.85
      });
      const moundGeo = new THREE.CylinderGeometry(0.38, 0.52, 0.06, 14);
      const mound = new THREE.Mesh(moundGeo, moundMat);
      mound.position.y = 0.03;
      mound.receiveShadow = true;
      plotGroup.add(mound);

      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d303a, roughness: 0.75 });
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.2;
        const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05, 0), stoneMat);
        stone.position.set(Math.cos(angle) * 0.42, 0.045, Math.sin(angle) * 0.42);
        plotGroup.add(stone);
      }

      const sproutMat = new THREE.MeshStandardMaterial({ color: 0x4a7a58, roughness: 0.5 });
      const sprout = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.16, 6), sproutMat);
      sprout.position.set(0, 0.08, 0);
      sprout.rotation.z = 0.1;
      plotGroup.add(sprout);

      const budMat = new THREE.MeshStandardMaterial({ color: 0xe89cb0, roughness: 0.35 });
      const bud = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 6), budMat);
      bud.position.set(0.015, 0.17, 0);
      plotGroup.add(bud);

      const plotLight = new THREE.PointLight(0xffd4de, 0.4, 2.0);
      plotLight.position.set(0, 0.25, 0);
      plotGroup.add(plotLight);

      const hitGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.45, 8);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
      const hitbox = new THREE.Mesh(hitGeo, hitMat);
      hitbox.position.y = 0.22;
      hitbox.userData = plotGroup.userData;
      plotGroup.add(hitbox);

      plotGroup.position.set(plotData.position3D.x, 0, plotData.position3D.z);
      this.scene.add(plotGroup);
      this.interactiveObjects.push(hitbox);
    });
  }

  createBotanicalFoliage() {
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x274431,
      roughness: 0.75,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    const bladeCount = 55;
    for (let i = 0; i < bladeCount; i++) {
      const clump = new THREE.Group();
      const bladeGeo = new THREE.PlaneGeometry(0.04, 0.26);
      bladeGeo.translate(0, 0.13, 0);

      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(bladeGeo, grassMat);
        blade.rotation.y = (b / 3) * Math.PI;
        blade.rotation.x = (Math.random() - 0.5) * 0.22;
        clump.add(blade);
      }

      const angle = Math.random() * Math.PI * 2;
      const dist = 1.3 + Math.random() * 5.2;
      clump.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      clump.scale.setScalar(0.75 + Math.random() * 0.55);

      this.scene.add(clump);
      this.grassMeshes.push(clump);
    }
  }

  update(delta, elapsedTime) {
    this.animatedFlowers.forEach((flower, idx) => {
      const sway = Math.sin(elapsedTime * 1.3 + idx * 1.1) * 0.022;
      flower.rotation.z = sway;
      flower.rotation.x = Math.cos(elapsedTime * 1.1 + idx * 0.8) * 0.015;
    });

    this.flowerBushes.forEach((bush, idx) => {
      bush.rotation.y = Math.sin(elapsedTime * 0.6 + idx) * 0.02;
    });

    this.grassMeshes.forEach((clump, idx) => {
      clump.rotation.z = Math.sin(elapsedTime * 1.8 + idx) * 0.03;
    });
  }
}
