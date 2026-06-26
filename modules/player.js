// player.js — GLB character with idle/walk animation + procedural fallback.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createGalleryGuide } from "./proceduralAssets.js";

// ponytail: tune to your GLB (origin at feet). Avaturn faces +Z (~1.7m tall).
// Skeleton must match across all clips — use Mixamo output for character too.
const MODEL_URL = `${import.meta.env.BASE_URL}models/guide/character.glb`; // Mixamo "Idle" With Skin
const WALK_URL = `${import.meta.env.BASE_URL}models/guide/walk.glb`; // Mixamo "Walking" Without Skin
const MODEL_SCALE = 3.0; // bigger = more prominent vs the room (glasspile-ish)
const MODEL_Y_OFFSET = -0.15; // nudge feet down if the avatar floats (more negative = lower)
const MODEL_FACE_OFFSET = 0; // set Math.PI if the avatar walks backwards
const FLOOR_Y = -3.08;
const FOCUS_HEIGHT = 3.1;
const FADE = 0.35; // crossfade seconds (higher = smoother transition)
const WALK_TIMESCALE = 0.46; // <1 slows the walk cadence so it's not rushed

// GLBs can carry stray/empty clips — pick the one with the longest duration.
const longestClip = (clips) =>
  clips.reduce((a, b) => (b.duration > a.duration ? b : a));

export const createPlayer = () => {
  const player = new THREE.Group();
  player.name = "player";
  player.position.set(6.2, FLOOR_Y, 7.1);
  player.userData.floorY = FLOOR_Y;
  player.userData.focusHeight = FOCUS_HEIGHT;

  const loader = new GLTFLoader();

  loader.load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(MODEL_SCALE);
      model.position.y = MODEL_Y_OFFSET;
      model.rotation.y = MODEL_FACE_OFFSET;
      model.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      player.add(model);

      const mixer = new THREE.AnimationMixer(model);
      player.userData.mixer = mixer;

      // Idle comes baked in character.glb; load walk separately. Crossfade on move.
      if (!gltf.animations.length) return; // no idle clip → stays in bind pose
      const idle = mixer.clipAction(longestClip(gltf.animations));
      idle.play();
      let current = idle;
      loader.load(WALK_URL, (g) => {
        const walk = mixer.clipAction(longestClip(g.animations));
        walk.setEffectiveTimeScale(WALK_TIMESCALE);
        player.userData.setMoving = (moving) => {
          const next = moving ? walk : idle;
          if (next === current) return;
          next.reset().play();
          next.crossFadeFrom(current, FADE, false);
          current = next;
        };
      });
    },
    undefined,
    (err) => {
      console.warn("GLB character failed, using procedural guide.", err);
      const guide = createGalleryGuide();
      guide.position.set(0, 0, 0);
      player.userData.walkParts = guide.userData.walkParts;
      player.add(guide);
    }
  );

  return player;
};
