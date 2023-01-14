// canvas edge cursor mapping
const CANVAS_EDGE_CURSOR_MAP = {
  [HIT_EDGE_TYPE.LEFT]: ['w-resize'],
  [HIT_EDGE_TYPE.RIGHT]: ['e-resize'],
  [HIT_EDGE_TYPE.TOP]: ['n-resize'],
  [HIT_EDGE_TYPE.BOTTOM]: ['s-resize'],
  [HIT_EDGE_TYPE.LEFT_TOP]: ['nw-resize'],
  [HIT_EDGE_TYPE.LEFT_BOTTOM]: ['sw-resize'],
  [HIT_EDGE_TYPE.RIGHT_TOP]: ['ne-resize'],
  [HIT_EDGE_TYPE.RIGHT_BOTTOM]: ['se-resize'],
  [HIT_EDGE_TYPE.NONE]: null,
}

const canvasInfo = {
  prevDevicePixelRatio: null,
  mouseHitBoxSize: 4,
  canvasEdgeSize: 20,
  hitCanvasEdge: HIT_EDGE_TYPE.NONE, // HIT_EDGE_TYPE matrix.js
  hitItems: [],
  targetStartMouse: null,
  targetItem: null,
}

function drawCanvas() {
  const offset = window.devicePixelRatio || 1;
  if (canvasInfo.prevDevicePixelRatio !== offset) {
    syncCanvasSize();
    canvasInfo.prevDevicePixelRatio = offset;
  }

  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width * offset, canvas.height * offset);

  const canvasImageWidth = globalData.image.width * offset;
  const canvasImageHeight = globalData.image.height * offset;
  const canvasBaseX = canvas.width / 2 - canvasImageWidth / 2;
  const canvasBaseY = canvas.height / 2 - canvasImageHeight / 2;
  const canvasRect = {
    x: canvasBaseX,
    y: canvasBaseY,
    w: canvasImageWidth,
    h: canvasImageHeight,
  };

  // draw canvas layout rect
  context.fillStyle = "white";
  context.fillRect(canvasRect.x, canvasRect.y, canvasRect.w, canvasRect.h);

  // reset mouse pointer
  canvas.style.cursor = 'default';

  // draw canvas edge
  if (canvasInfo.hitCanvasEdge !== HIT_EDGE_TYPE.NONE) {
    // get canvas edge rects
    const {
      c_edge_left,
      c_edge_right,
      c_edge_top,
      c_edge_bottom,
      c_edge_left_top,
      c_edge_left_bottom,
      c_edge_right_top,
      c_edge_right_bottom,
    } = getCanvasEdge();
  
    // canvas edge matrix mapping
    const CANVAS_EDGE_MATRIX_MAP = {
      [HIT_EDGE_TYPE.LEFT]: c_edge_left,
      [HIT_EDGE_TYPE.RIGHT]: c_edge_right,
      [HIT_EDGE_TYPE.TOP]: c_edge_top,
      [HIT_EDGE_TYPE.BOTTOM]: c_edge_bottom,
      [HIT_EDGE_TYPE.LEFT_TOP]: c_edge_left_top,
      [HIT_EDGE_TYPE.LEFT_BOTTOM]: c_edge_left_bottom,
      [HIT_EDGE_TYPE.RIGHT_TOP]: c_edge_right_top,
      [HIT_EDGE_TYPE.RIGHT_BOTTOM]: c_edge_right_bottom,
      [HIT_EDGE_TYPE.NONE]: null,
    };

    const targetEdge = CANVAS_EDGE_MATRIX_MAP[canvasInfo.hitCanvasEdge];
    const targetEdgeCurosr = CANVAS_EDGE_CURSOR_MAP[canvasInfo.hitCanvasEdge];
    canvas.style.cursor = targetEdgeCurosr;

    context.fillStyle = "#333";
    context.fillRect(targetEdge.x, targetEdge.y, targetEdge.w, targetEdge.h);
  }

  // draw items
  globalData.itemBoxList.forEach((itemBox) => {
    const base = { x: canvasBaseX, y: canvasBaseY };
    const state = {
      hover: itemBox.id === globalData.hoverItem?.id,
      focus: itemBox.id === globalData.focusItem?.id,
    };
    itemBox.item.draw(context, base, itemBox, state);
  })

  window.requestAnimationFrame(drawCanvas);
}

function syncCanvasSize() {
  const canvas = document.querySelector("#main-canvas");
  const canvasWrap = canvas.parentNode;

  const wrapWidth = canvasWrap.offsetWidth;
  const wrapHeight = canvasWrap.offsetHeight;

  const offset = window.devicePixelRatio || 1;

  canvas.width = wrapWidth * offset;
  canvas.height = wrapHeight * offset;
}
