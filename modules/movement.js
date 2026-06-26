import * as THREE from "three";

export const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const movementDirection = new THREE.Vector3();
const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const targetCameraPosition = new THREE.Vector3();
const cameraLookTarget = new THREE.Vector3();
const collisionBox = new THREE.Box3();
const collisionCenter = new THREE.Vector3();

let cameraYaw = 0;
let cameraPitch = 0.28;
let walkTime = 0;

const PLAYER_SPEED = 3.8;
const CAMERA_DISTANCE = 7.4;
const MOUSE_SENSITIVITY = 0.0022;
const MIN_CAMERA_PITCH = -0.08;
const MAX_CAMERA_PITCH = 0.62;

const damp = (current, target, lambda, delta) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));

const lerpAngle = (current, target, amount) => {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * amount;
};

export const handleMouseLook = (event, controls) => {
  if (!controls.isLocked) {
    return;
  }

  cameraYaw -= event.movementX * MOUSE_SENSITIVITY;
  cameraPitch = THREE.MathUtils.clamp(
    cameraPitch - event.movementY * MOUSE_SENSITIVITY,
    MIN_CAMERA_PITCH,
    MAX_CAMERA_PITCH
  );
};

export const initializeThirdPersonCamera = (camera, player) => {
  updateFollowCamera(camera, player, 1, true);
};

export const updateMovement = (delta, controls, camera, walls, player) => {
  if (!player) {
    return;
  }

  const isMoving = controls.isLocked && movePlayer(delta, walls, player);
  if (player.userData.mixer) player.userData.mixer.update(delta);
  if (player.userData.setMoving) player.userData.setMoving(isMoving);
  updateCharacterAnimation(player, isMoving, delta);
  updateFollowCamera(camera, player, delta);
};

const movePlayer = (delta, walls, player) => {
  const forwardInput = Number(keysPressed.ArrowUp || keysPressed.w) - Number(keysPressed.ArrowDown || keysPressed.s);
  const strafeInput = Number(keysPressed.ArrowRight || keysPressed.d) - Number(keysPressed.ArrowLeft || keysPressed.a);

  movementDirection.set(0, 0, 0);
  if (forwardInput === 0 && strafeInput === 0) {
    return false;
  }

  cameraForward.set(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
  cameraRight.set(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));
  movementDirection
    .addScaledVector(cameraForward, forwardInput)
    .addScaledVector(cameraRight, strafeInput)
    .normalize();

  const previousPosition = player.position.clone();
  player.position.addScaledVector(movementDirection, PLAYER_SPEED * delta);
  player.position.y = player.userData.floorY ?? player.position.y;

  if (checkCollision(player.position, walls)) {
    player.position.copy(previousPosition);
    return false;
  }

  const targetRotation = Math.atan2(movementDirection.x, movementDirection.z);
  player.rotation.y = lerpAngle(player.rotation.y, targetRotation, Math.min(1, delta * 12));
  return true;
};

const updateFollowCamera = (camera, player, delta, instant = false) => {
  const focusHeight = player.userData.focusHeight ?? 3;
  cameraLookTarget.set(player.position.x, player.position.y + focusHeight, player.position.z);

  targetCameraPosition.set(
    player.position.x + Math.sin(cameraYaw) * Math.cos(cameraPitch) * CAMERA_DISTANCE,
    cameraLookTarget.y + Math.sin(cameraPitch) * CAMERA_DISTANCE,
    player.position.z + Math.cos(cameraYaw) * Math.cos(cameraPitch) * CAMERA_DISTANCE
  );

  if (instant) {
    camera.position.copy(targetCameraPosition);
  } else {
    camera.position.lerp(targetCameraPosition, 1 - Math.exp(-8 * delta));
  }

  camera.lookAt(cameraLookTarget);
};

const updateCharacterAnimation = (player, isMoving, delta) => {
  const parts = player.userData.walkParts;
  if (!parts) {
    return;
  }

  Object.values(parts).forEach((part) => {
    if (!part.userData.baseRotation) {
      part.userData.baseRotation = part.rotation.clone();
    }
  });

  if (isMoving) {
    walkTime += delta * 8.5;
  }

  const swing = isMoving ? Math.sin(walkTime) * 0.45 : 0;
  const armSwing = swing * 0.8;

  parts.leftLeg.rotation.x = damp(parts.leftLeg.rotation.x, swing, 12, delta);
  parts.rightLeg.rotation.x = damp(parts.rightLeg.rotation.x, -swing, 12, delta);
  parts.leftArm.rotation.x = damp(parts.leftArm.rotation.x, -armSwing, 12, delta);
  parts.rightArm.rotation.x = damp(parts.rightArm.rotation.x, armSwing, 12, delta);

  if (!isMoving) {
    parts.leftLeg.rotation.x = damp(parts.leftLeg.rotation.x, 0, 10, delta);
    parts.rightLeg.rotation.x = damp(parts.rightLeg.rotation.x, 0, 10, delta);
    parts.leftArm.rotation.x = damp(parts.leftArm.rotation.x, 0, 10, delta);
    parts.rightArm.rotation.x = damp(parts.rightArm.rotation.x, 0, 10, delta);
  }
};

export const checkCollision = (position, walls) => {
  collisionCenter.set(position.x, position.y + 1.5, position.z);
  collisionBox.setFromCenterAndSize(collisionCenter, new THREE.Vector3(0.9, 2.8, 0.9));

  for (let i = 0; i < walls.children.length; i += 1) {
    const wall = walls.children[i];
    if (wall.BoundingBox && collisionBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }

  return false;
};
