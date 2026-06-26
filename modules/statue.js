// statue.js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createProceduralStatue } from "./proceduralAssets.js";

const FLOOR_Y = -Math.PI; // matches floor.js
const TARGET_HEIGHT = 6; // how tall the statue should stand, in world units
export const statueColliders = [];

const addStatueCollider = (statue) => {
  statue.updateWorldMatrix(true, true);
  statueColliders.push(new THREE.Box3().setFromObject(statue));
};

export const loadStatueModel = (scene) => {
  const loader = new GLTFLoader();

  const addFallbackStatue = () => {
    const statue = createProceduralStatue();
    scene.add(statue);
    addStatueCollider(statue);
  };

  loader.load(
    `${import.meta.env.BASE_URL}models/statue/aphrodite.glb`,
    (gltf) => {
      const statue = gltf.scene;

      statue.traverse((child) => {
        if (child.isMesh) {
          // Scan has no marble texture (flat grey) — override to white marble.
          child.material = new THREE.MeshStandardMaterial({
            color: 0xf0ece4,
            emissive: 0x141414, // subtle lift only — too much flattens the carving
            metalness: 0.0,
            roughness: 0.45,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Auto-fit: scale unknown GLB to TARGET_HEIGHT, then sit base on the floor.
      const box = new THREE.Box3().setFromObject(statue);
      const size = box.getSize(new THREE.Vector3());
      statue.scale.setScalar(TARGET_HEIGHT / size.y);

      const fitted = new THREE.Box3().setFromObject(statue);
      const center = fitted.getCenter(new THREE.Vector3());
      statue.position.x -= center.x;
      statue.position.z -= center.z;
      statue.position.y += FLOOR_Y - fitted.min.y; // base on the floor

      scene.add(statue);
      addStatueCollider(statue);
    },
    undefined,
    (error) => {
      console.warn("Using procedural statue fallback.", error);
      addFallbackStatue();
    }
  );
};
