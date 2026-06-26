import * as THREE from "three";
import { createWallTexture } from "./proceduralAssets.js";

export function createWalls(scene) {
  let wallGroup = new THREE.Group();
  scene.add(wallGroup);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4f2ef,
    map: createWallTexture(),
    roughness: 0.76,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  // Front Wall
  const frontWall = new THREE.Mesh( 
    new THREE.BoxGeometry(80, 20, 0.001), 
    wallMaterial 
  );

  frontWall.position.z = -20; 

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001), 
    wallMaterial
  );

  leftWall.rotation.y = Math.PI / 2; 
  leftWall.position.x = -20; 

  // Right Wall
  const rightWall = new THREE.Mesh( 
    new THREE.BoxGeometry(80, 20, 0.001), 
    wallMaterial
  );

  rightWall.position.x = 20;
  rightWall.rotation.y = Math.PI / 2; 

  // Back Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    wallMaterial 
  );
  backWall.position.z = 20;

  wallGroup.add(frontWall, backWall, leftWall, rightWall);
  wallGroup.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true;
    }
  });

  return wallGroup;
}
