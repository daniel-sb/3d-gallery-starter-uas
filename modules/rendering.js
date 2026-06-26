import * as THREE from "three";
import { displayPaintingInfo, hidePaintingInfo } from "./paintingInfo.js";
import { initializeThirdPersonCamera, updateMovement } from "./movement.js";
import {
  isPaintingFocused,
  getFocusedPainting,
  updatePaintingFocus,
} from "./paintingFocus.js";

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls,
  player
) => {
  const clock = new THREE.Clock();
  initializeThirdPersonCamera(camera, player);

  let render = function () {
    const delta = clock.getDelta();

    if (isPaintingFocused()) {
      // Zoomed in on an artwork: glide the camera, keep idle anim + caption.
      updatePaintingFocus(camera, delta);
      if (player.userData.mixer) player.userData.mixer.update(delta);
      displayPaintingInfo(getFocusedPainting().userData.info);
    } else {
      updateMovement(delta, controls, camera, walls, player);

      const distanceThreshold = 8;

      let paintingToShow;
      paintings.forEach((painting) => {
        const distanceToPainting = player.position.distanceTo(painting.position);
        if (distanceToPainting < distanceThreshold) {
          paintingToShow = painting;
        }
      });

      if (controls.isLocked && paintingToShow) {
        // if there is a painting to show
        displayPaintingInfo(paintingToShow.userData.info);
      } else {
        hidePaintingInfo();
      }
    }

    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
};
