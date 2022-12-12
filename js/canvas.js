const canvasInfo = {
  mouseHitBoxSize: 4,
  canvasEdgeSize: 20,
  hitCanvasEdge: null, // HIT_EDGE_TYPE
  hitItems: [],
}

function drawCanvas() {
    const canvas = document.querySelector("#main-canvas");
    const context = canvas.getContext("2d");
  
    const offset = window.devicePixelRatio || 1;
    const image = globalData.image;
    context.clearRect(0, 0, image.width * offset, image.height * offset);

    const canvasRect = {
      x: canvas.width / 2 - globalData.image.width / 2,
      y: canvas.height / 2 - globalData.image.height / 2,
      w: globalData.image.width,
      h: globalData.image.height
    }
  
    // draw canvas layout rect
    context.fillStyle = "white";
    context.fillRect(canvasRect.x, canvasRect.y, canvasRect.w, canvasRect.h);

    // draw canvas edge
    // L R T B LT LB RT RB 순서대로 그리기
    // 마우스랑 캔버스 모서리랑 충돌 했고, 다른 충돌 아이템이 없는 경우
    // 1. 캔버스 크기 조절 그림 표시
    // 2. 마우스 모양 변경
  
    // draw items
    // todo...
  
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

  function getCanvasEdge() {
    const canvas = document.querySelector("#main-canvas");
    const canvasItem = {
      x: canvas.width / 2 - globalData.image.width / 2,
      y: canvas.height / 2 - globalData.image.height / 2,
      w: globalData.image.width,
      h: globalData.image.height,
    };

    const c_left = canvasItem.x;
    const c_right = canvasItem.x + canvasItem.w;
    const c_top = canvasItem.y;
    const c_bottom = canvasItem.y + canvasItem.h;
    const c_width = canvasItem.w;
    const c_height = canvasItem.h;

    const c_edge_left = {
      x: c_left - canvasInfo.canvasEdgeSize,
      y: c_top - canvasInfo.canvasEdgeSize,
      w: canvasInfo.canvasEdgeSize,
      h: c_height + canvasInfo.canvasEdgeSize * 2,
    }
    const c_edge_right = {
      x: c_right,
      y: c_top - canvasInfo.canvasEdgeSize,
      w: canvasInfo.canvasEdgeSize,
      h: c_height + canvasInfo.canvasEdgeSize * 2,
    }
    const c_edge_top = {
      x: c_left - canvasInfo.canvasEdgeSize,
      y: c_top - canvasInfo.canvasEdgeSize,
      w: c_width + canvasInfo.canvasEdgeSize * 2,
      h: canvasInfo.canvasEdgeSize,
    }
    const c_edge_bottom = {
      x: c_left - canvasInfo.canvasEdgeSize,
      y: c_bottom,
      w: c_width + canvasInfo.canvasEdgeSize * 2,
      h: canvasInfo.canvasEdgeSize,
    }

    return {
      c_edge_left,
      c_edge_right,
      c_edge_top,
      c_edge_bottom,
    }
  }
  
  function onCanvasMouseEvent(event) {
    const { offsetX: mouseX, offsetY: mouseY, type } = event;

    const mouseItem = {
      x: mouseX - canvasInfo.mouseHitBoxSize / 2,
      y: mouseY - canvasInfo.mouseHitBoxSize / 2,
      w: canvasInfo.mouseHitBoxSize,
      h: canvasInfo.mouseHitBoxSize,
    }

    canvasInfo.hitCanvasEdge = hitTestCanvasEdge(mouseItem);

    const itemList = getItemList(); // index.js
    canvasInfo.hitItems = itemList.filter((item) => {
      return hitTest(item, mouseItem) !== HIT_TYPE.NONE;
    })
  }

  const HIT_EDGE_TYPE = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT_TOP: 'LEFT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_TOP: 'RIGHT_TOP',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
    NONE: 'NONE',
  }
  function hitTestCanvasEdge(mouseItem) {
    const {
      c_edge_left,
      c_edge_right,
      c_edge_top,
      c_edge_bottom,
    } = getCanvasEdge();

    const IS_HIT_LEFT = hitTest(c_edge_left, mouseItem) !== HIT_TYPE.NONE;
    const IS_HIT_RIGHT = hitTest(c_edge_right, mouseItem) !== HIT_TYPE.NONE;
    const IS_HIT_TOP = hitTest(c_edge_top, mouseItem) !== HIT_TYPE.NONE;
    const IS_HIT_BOTTOM = hitTest(c_edge_bottom, mouseItem) !== HIT_TYPE.NONE;

    if (IS_HIT_LEFT) {
      if (IS_HIT_TOP) return HIT_EDGE_TYPE.LEFT_TOP;
      if (IS_HIT_BOTTOM) return HIT_EDGE_TYPE.LEFT_BOTTOM;
      return HIT_EDGE_TYPE.LEFT;
    }
    if (IS_HIT_RIGHT) {
      if (IS_HIT_TOP) return HIT_EDGE_TYPE.RIGHT_TOP;
      if (IS_HIT_BOTTOM) return HIT_EDGE_TYPE.RIGHT_BOTTOM;
      return HIT_EDGE_TYPE.RIGHT;
    }
    if (IS_HIT_TOP) return HIT_EDGE_TYPE.TOP;
    if (IS_HIT_BOTTOM) return HIT_EDGE_TYPE.BOTTOM;

    return HIT_EDGE_TYPE.NONE;
  }

  const HIT_TYPE = {
    HAVE: 'HAVE', // TARGET IN ORIGIN
    GO_IN: 'GO_IN', // ORIGIN IN TARGET
    HIT: 'HIT', // EACH OTHER HIT
    NONE: 'NONE', // NO HIT
  }
  function hitTest(origin, target) {
    const { x: ox, y: oy, w: ow, h: oh } = origin;
    const { x: tx, y: ty, w: tw, h: th } = target;

    const t_left = tx;
    const t_right = tx + tw;
    const t_top = ty;
    const t_bottom = ty + th;
    
    const o_left = ox;
    const o_right = ox + ow;
    const o_top = oy;
    const o_bottom = oy + oh;

    const t_row_in_o = o_left <= t_left && t_right <= o_right;
    const t_col_in_o = o_top <= t_top && t_bottom <= o_bottom;
    const o_row_in_t = t_left <= o_left && o_right <= t_right;
    const o_col_in_t = t_top <= o_top && o_bottom <= t_bottom;

    const t_row_some_o = o_left <= t_right && t_left <= o_right;
    const t_col_some_o = o_top <= t_bottom && t_top <= o_bottom;
    const o_row_some_t = t_left <= o_right && o_left <= t_right;
    const o_col_some_t = t_top <= o_bottom && o_top <= t_bottom;

    if (t_row_in_o && t_col_in_o) {
      return HIT_TYPE.HAVE;
    }
    if (o_row_in_t && o_col_in_t) {
      return HIT_TYPE.GO_IN;
    }

    const condition1 = t_row_in_o && o_col_in_t;
    const condition2 = o_row_in_t && t_col_in_o;
    const condition3 = t_row_some_o && t_col_some_o;
    const condition4 = o_row_some_t && o_col_some_t;
    if (condition1 || condition2 || condition3 || condition4) {
      return HIT_TYPE.HIT;
    }

    return HIT_TYPE.NONE;
  }
