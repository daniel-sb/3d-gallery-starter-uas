// paintingFocus.js — click a painting to glide the camera to a head-on POV.
import * as THREE from "three";

let focused = null; // the painting Mesh currently focused, or null
const targetPos = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const worldDir = new THREE.Vector3();

const PADDING = 1.15; // >1 leaves margin around the artwork in frame

export const isPaintingFocused = () => focused !== null;
export const getFocusedPainting = () => focused;
export const clearPaintingFocus = () => {
  focused = null;
};

export const focusOnPainting = (painting, camera) => {
  focused = painting;

  // Plane normal (+Z) in world space points out from the artwork into the room.
  painting.getWorldDirection(worldDir);

  // Distance so the painting height fits the vertical FOV, with padding.
  const h = painting.geometry.parameters.height ?? 4;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const dist = (h / 2 / Math.tan(fov / 2)) * PADDING;

  targetPos.copy(painting.position).addScaledVector(worldDir, dist);
  lookTarget.copy(painting.position);
};

export const updatePaintingFocus = (camera, delta) => {
  if (!focused) return;
  const t = 1 - Math.exp(-6 * delta); // smooth approach
  camera.position.lerp(targetPos, t);
  camera.lookAt(lookTarget);
};
