import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createProceduralCeilingLamp } from "./proceduralAssets.js";

export const loadCeilingLampModel = (scene) => {
  const loader = new GLTFLoader();

  loader.load(
    `${import.meta.env.BASE_URL}models/ceiling-lamp/scene.gltf`,
    (gltf) => {
      const lamp = gltf.scene;

      lamp.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Position the lamp
      lamp.position.set(0, 5.5, 0);
      lamp.scale.set(0.1, 0.1, 0.1);

      // Add the lamp to the scene
      scene.add(lamp);
    },
    undefined,
    (error) => {
      console.warn("Using procedural ceiling lamp fallback.", error);
      scene.add(createProceduralCeilingLamp());
    }
  );
};
