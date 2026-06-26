import * as THREE from 'three';
import {
  focusOnPainting,
  clearPaintingFocus,
  isPaintingFocused,
} from './paintingFocus.js';

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function clickHandling(renderer, camera, paintings) {
  renderer.domElement.addEventListener(
    'click',
    (event) => {
      // Already zoomed in → any click steps back out.
      if (isPaintingFocused()) {
        clearPaintingFocus();
        return;
      }
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      onClick(camera, paintings);
    },
    false
  );
}

function onClick(camera, paintings) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(paintings);
  if (intersects.length > 0) {
    focusOnPainting(intersects[0].object, camera);
  }
}

export { clickHandling };
