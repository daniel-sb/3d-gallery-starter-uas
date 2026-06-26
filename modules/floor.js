import * as THREE from "three";

export const setupFloor = (scene) => {
  const planeGeometry = new THREE.PlaneGeometry(45, 45);

  const floorTexture = new THREE.TextureLoader().load(
    `${import.meta.env.BASE_URL}img/Floor.jpg`
  );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4); // tiling knob — bump up if it looks stretched

  const planeMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.46,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

  floorPlane.rotation.x = Math.PI / 2;
  floorPlane.position.y = -Math.PI;
  floorPlane.receiveShadow = true;

  scene.add(floorPlane);
  return floorPlane;
};
