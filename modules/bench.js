import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createProceduralBenches } from "./proceduralAssets.js";

export const loadBenchModel = (scene) => {
  const loader = new GLTFLoader();

  loader.load(
    `${import.meta.env.BASE_URL}models/bench_2/scene.gltf`,
    (gltf) => {
      const bench = gltf.scene;

      bench.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Default Position and Scale
      bench.position.set(0, -3.12, -8);
      bench.rotation.set(0, 0, 0);
      bench.scale.set(3, 3, 3);

      // Add the bench to the scene
      scene.add(bench);
    },
    undefined,
    (error) => {
      console.warn("Using procedural bench fallback.", error);
      scene.add(createProceduralBenches());
    }
  );
};
