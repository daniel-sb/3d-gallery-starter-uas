import * as THREE from "three";

const setTextureDefaults = (texture, repeatX = 1, repeatY = 1) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const createCanvasTexture = (width, height, draw, repeatX = 1, repeatY = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  draw(context, width, height);
  return setTextureDefaults(new THREE.CanvasTexture(canvas), repeatX, repeatY);
};

const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const addSubtleNoise = (context, width, height, amount, random) => {
  for (let i = 0; i < amount; i += 1) {
    const alpha = 0.02 + random() * 0.08;
    const shade = Math.floor(80 + random() * 100);
    context.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
    context.fillRect(random() * width, random() * height, 1 + random() * 3, 1);
  }
};

export const createWoodFloorTexture = () =>
  createCanvasTexture(
    1024,
    1024,
    (context, width, height) => {
      const random = seededRandom(27);
      context.fillStyle = "#b98955";
      context.fillRect(0, 0, width, height);

      const plankHeight = height / 8;
      for (let row = 0; row < 8; row += 1) {
        const y = row * plankHeight;
        const offset = row % 2 === 0 ? 0 : width / 4;

        for (let plank = -1; plank < 4; plank += 1) {
          const x = plank * (width / 2) + offset;
          const hue = 31 + random() * 10;
          const lightness = 45 + random() * 12;
          context.fillStyle = `hsl(${hue}, 38%, ${lightness}%)`;
          context.fillRect(x, y, width / 2, plankHeight);

          const gradient = context.createLinearGradient(x, y, x, y + plankHeight);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.16)");
          gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.02)");
          gradient.addColorStop(1, "rgba(54, 29, 12, 0.18)");
          context.fillStyle = gradient;
          context.fillRect(x, y, width / 2, plankHeight);

          context.strokeStyle = "rgba(80, 43, 18, 0.34)";
          context.lineWidth = 1;
          for (let grain = 0; grain < 18; grain += 1) {
            const gy = y + 8 + random() * (plankHeight - 16);
            context.beginPath();
            context.moveTo(x + 12, gy);
            context.bezierCurveTo(
              x + width * 0.15,
              gy + random() * 14 - 7,
              x + width * 0.35,
              gy + random() * 14 - 7,
              x + width / 2 - 12,
              gy + random() * 12 - 6
            );
            context.stroke();
          }

          if (random() > 0.55) {
            const knotX = x + 80 + random() * (width / 2 - 160);
            const knotY = y + 18 + random() * (plankHeight - 36);
            context.strokeStyle = "rgba(75, 38, 17, 0.45)";
            context.lineWidth = 2;
            context.beginPath();
            context.ellipse(knotX, knotY, 18 + random() * 14, 5 + random() * 5, random(), 0, Math.PI * 2);
            context.stroke();
          }
        }

        context.strokeStyle = "rgba(52, 30, 16, 0.55)";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.strokeStyle = "rgba(44, 24, 12, 0.48)";
      context.lineWidth = 2;
      for (let column = 0; column < 5; column += 1) {
        const x = column * (width / 2);
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      addSubtleNoise(context, width, height, 2400, random);
    },
    5,
    5
  );

export const createCeilingTileTexture = () =>
  createCanvasTexture(
    1024,
    1024,
    (context, width, height) => {
      const random = seededRandom(41);
      context.fillStyle = "#c7c5bc";
      context.fillRect(0, 0, width, height);

      const tileSize = width / 4;
      context.strokeStyle = "rgba(72, 72, 68, 0.36)";
      context.lineWidth = 5;
      for (let i = 0; i <= 4; i += 1) {
        context.beginPath();
        context.moveTo(i * tileSize, 0);
        context.lineTo(i * tileSize, height);
        context.stroke();

        context.beginPath();
        context.moveTo(0, i * tileSize);
        context.lineTo(width, i * tileSize);
        context.stroke();
      }

      context.fillStyle = "rgba(47, 47, 47, 0.82)";
      [
        [0.55, 0.2],
        [2.65, 0.85],
        [1.55, 2.55],
        [3.3, 3.05],
      ].forEach(([x, y]) => {
        context.fillRect(x * tileSize, y * tileSize, tileSize * 0.55, tileSize * 0.35);
      });

      context.fillStyle = "rgba(255, 255, 255, 0.18)";
      for (let i = 0; i < 80; i += 1) {
        context.beginPath();
        context.arc(random() * width, random() * height, 1 + random() * 2, 0, Math.PI * 2);
        context.fill();
      }

      addSubtleNoise(context, width, height, 3200, random);
    },
    6,
    5
  );

export const createWallTexture = () =>
  createCanvasTexture(
    768,
    768,
    (context, width, height) => {
      const random = seededRandom(73);
      context.fillStyle = "#ededeb";
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 520; i += 1) {
        const alpha = 0.04 + random() * 0.1;
        context.strokeStyle = `rgba(120, 120, 116, ${alpha})`;
        context.lineWidth = random() * 1.4;
        const x = random() * width;
        const y = random() * height;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + random() * 60 - 30, y + random() * 16 - 8);
        context.stroke();
      }

      addSubtleNoise(context, width, height, 2800, random);
    },
    8,
    3
  );

const applyShadows = (object) => {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
};

const createMaterial = (color, roughness = 0.55, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const addMesh = (group, geometry, material, position, rotation, scale) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (rotation) {
    mesh.rotation.set(...rotation);
  }
  if (scale) {
    mesh.scale.set(...scale);
  }
  group.add(mesh);
  return mesh;
};

export const createProceduralStatue = () => {
  const statue = new THREE.Group();
  statue.name = "procedural-statue";

  const marble = createMaterial(0xf0eee8, 0.32);
  const shadowMarble = createMaterial(0xd9d5cc, 0.45);

  addMesh(statue, new THREE.CylinderGeometry(1.15, 1.35, 0.28, 48), shadowMarble, [0, 0.14, 0]);
  addMesh(statue, new THREE.CylinderGeometry(0.86, 1.03, 0.72, 48), marble, [0, 0.64, 0]);
  addMesh(statue, new THREE.CylinderGeometry(0.72, 0.86, 0.22, 48), shadowMarble, [0, 1.11, 0]);

  addMesh(statue, new THREE.SphereGeometry(0.72, 40, 22), marble, [0, 1.62, 0], null, [1, 0.58, 0.48]);
  addMesh(statue, new THREE.CylinderGeometry(0.26, 0.32, 0.38, 32), marble, [0, 2.0, 0]);
  addMesh(statue, new THREE.SphereGeometry(0.36, 40, 24), marble, [0, 2.32, 0]);
  addMesh(statue, new THREE.SphereGeometry(0.38, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2), shadowMarble, [0, 2.43, -0.02]);

  addMesh(statue, new THREE.CylinderGeometry(0.14, 0.17, 0.9, 24), marble, [-0.55, 1.57, 0], [0, 0, -0.45]);
  addMesh(statue, new THREE.CylinderGeometry(0.14, 0.17, 0.9, 24), marble, [0.55, 1.57, 0], [0, 0, 0.45]);
  addMesh(statue, new THREE.TorusGeometry(0.38, 0.035, 12, 48), shadowMarble, [0, 1.26, 0.17], [Math.PI / 2, 0, 0]);

  statue.position.set(0, -3.12, -1.5);
  statue.scale.set(1.05, 1.05, 1.05);
  return applyShadows(statue);
};

const createBench = (position, rotationY) => {
  const bench = new THREE.Group();
  const seatMaterial = createMaterial(0xc8a06f, 0.48);
  const metalMaterial = createMaterial(0xe8e8e3, 0.3, 0.05);

  addMesh(bench, new THREE.BoxGeometry(4.8, 0.22, 1.05), seatMaterial, [0, 0.95, 0]);
  addMesh(bench, new THREE.BoxGeometry(4.8, 0.18, 0.18), metalMaterial, [0, 1.16, -0.44]);
  addMesh(bench, new THREE.BoxGeometry(4.8, 0.18, 0.18), metalMaterial, [0, 1.16, 0.44]);

  [-1.9, 1.9].forEach((x) => {
    addMesh(bench, new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16), metalMaterial, [x, 0.48, -0.38], [0.18, 0, 0]);
    addMesh(bench, new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16), metalMaterial, [x, 0.48, 0.38], [-0.18, 0, 0]);
    addMesh(bench, new THREE.BoxGeometry(0.75, 0.06, 0.08), metalMaterial, [x, 0.03, -0.58]);
    addMesh(bench, new THREE.BoxGeometry(0.75, 0.06, 0.08), metalMaterial, [x, 0.03, 0.58]);
  });

  bench.position.set(...position);
  bench.rotation.y = rotationY;
  return applyShadows(bench);
};

export const createProceduralBenches = () => {
  const benches = new THREE.Group();
  benches.name = "procedural-benches";
  benches.add(createBench([-9.2, -3.08, 5.6], Math.PI / 2.9));
  benches.add(createBench([9.2, -3.08, 4.6], -Math.PI / 2.9));
  return benches;
};

export const createProceduralCeilingLamp = () => {
  const lamps = new THREE.Group();
  lamps.name = "procedural-ceiling-lamps";
  const metal = createMaterial(0x2f3033, 0.35, 0.2);
  const glow = new THREE.MeshStandardMaterial({
    color: 0xfff2c2,
    emissive: 0xffd98b,
    emissiveIntensity: 1.3,
    roughness: 0.25,
  });

  [
    [0, 0],
    [-9, -9],
    [9, -9],
    [-9, 9],
    [9, 9],
  ].forEach(([x, z]) => {
    const lamp = new THREE.Group();
    addMesh(lamp, new THREE.CylinderGeometry(0.035, 0.035, 1.35, 12), metal, [0, 0.72, 0]);
    addMesh(lamp, new THREE.CylinderGeometry(0.42, 0.62, 0.38, 32, 1, true), metal, [0, 0.02, 0]);
    addMesh(lamp, new THREE.SphereGeometry(0.24, 24, 16), glow, [0, -0.18, 0]);
    lamp.position.set(x, 8.25, z);
    lamps.add(lamp);
  });

  return applyShadows(lamps);
};

export const createGalleryGuide = () => {
  const guide = new THREE.Group();
  guide.name = "gallery-guide";

  const suit = createMaterial(0x111114, 0.42);
  const shirt = createMaterial(0xf5f0e8, 0.38);
  const skin = createMaterial(0x9b6a4c, 0.5);
  const hair = createMaterial(0x19100d, 0.56);
  const shoes = createMaterial(0x070707, 0.35);
  const tie = createMaterial(0xd1ad56, 0.42);

  const leftLeg = addMesh(guide, new THREE.CylinderGeometry(0.17, 0.16, 1.22, 20), suit, [-0.25, 0.7, 0]);
  const rightLeg = addMesh(guide, new THREE.CylinderGeometry(0.17, 0.16, 1.22, 20), suit, [0.25, 0.7, 0]);
  addMesh(guide, new THREE.BoxGeometry(0.45, 0.16, 0.68), shoes, [-0.25, 0.08, 0.08]);
  addMesh(guide, new THREE.BoxGeometry(0.45, 0.16, 0.68), shoes, [0.25, 0.08, 0.08]);

  addMesh(guide, new THREE.BoxGeometry(1.05, 1.16, 0.48), suit, [0, 1.62, 0]);
  addMesh(guide, new THREE.BoxGeometry(0.38, 1.0, 0.04), shirt, [0, 1.62, 0.265]);
  addMesh(guide, new THREE.BoxGeometry(0.12, 0.74, 0.055), tie, [0, 1.52, 0.31]);

  const leftArm = addMesh(guide, new THREE.CylinderGeometry(0.12, 0.13, 1.04, 20), suit, [-0.67, 1.48, 0.02], [0, 0, -0.15]);
  const rightArm = addMesh(guide, new THREE.CylinderGeometry(0.12, 0.13, 1.04, 20), suit, [0.67, 1.48, 0.02], [0, 0, 0.15]);
  addMesh(guide, new THREE.SphereGeometry(0.14, 20, 14), skin, [-0.78, 0.93, 0.05]);
  addMesh(guide, new THREE.SphereGeometry(0.14, 20, 14), skin, [0.78, 0.93, 0.05]);

  addMesh(guide, new THREE.CylinderGeometry(0.18, 0.2, 0.24, 24), skin, [0, 2.3, 0]);
  addMesh(guide, new THREE.SphereGeometry(0.34, 36, 24), skin, [0, 2.58, 0]);
  addMesh(guide, new THREE.SphereGeometry(0.36, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2), hair, [0, 2.74, 0.01]);
  addMesh(guide, new THREE.SphereGeometry(0.18, 24, 16), hair, [0, 2.46, 0.28], null, [1.25, 0.65, 0.28]);
  addMesh(guide, new THREE.SphereGeometry(0.055, 12, 8), hair, [-0.12, 2.62, 0.31]);
  addMesh(guide, new THREE.SphereGeometry(0.055, 12, 8), hair, [0.12, 2.62, 0.31]);

  guide.position.set(6.2, -3.08, 7.1);
  guide.rotation.y = 0;
  guide.scale.set(1.45, 1.45, 1.45);
  guide.userData.floorY = -3.08;
  guide.userData.focusHeight = 3.1;
  guide.userData.walkParts = {
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
  };

  return applyShadows(guide);
};
