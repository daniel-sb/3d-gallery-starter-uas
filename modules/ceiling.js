import * as THREE from "three";
import { createCeilingTileTexture } from "./proceduralAssets.js";

export const createCeiling = (scene) => {
  const ceilingGeometry = new THREE.PlaneGeometry(45, 40);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: createCeilingTileTexture(),
    color: 0xf1efe7,
    roughness: 0.82,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

  ceilingPlane.rotation.x = Math.PI / 2;

  ceilingPlane.position.y = 10;
  ceilingPlane.receiveShadow = true;

  scene.add(ceilingPlane);
  return ceilingPlane;
};
