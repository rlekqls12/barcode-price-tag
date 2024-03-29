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

const HIT_TYPE = {
  HAVE: 'HAVE', // TARGET IN ORIGIN
  GO_IN: 'GO_IN', // ORIGIN IN TARGET
  HIT: 'HIT', // EACH OTHER HIT
  NONE: 'NONE', // NO HIT
}

function onMouseEvent(event) {
  const { offsetX: mouseX, offsetY: mouseY, type } = event;

  const offset = window.devicePixelRatio || 1;
  const mouseHitBoxSize = canvasInfo.mouseHitBoxSize * offset;

  const mouseItem = {
    x: mouseX * offset - mouseHitBoxSize / 2,
    y: mouseY * offset - mouseHitBoxSize / 2,
    w: mouseHitBoxSize,
    h: mouseHitBoxSize,
  }

  if (type === 'mousedown') {
    if (canvasInfo.hitCanvasEdge !== HIT_EDGE_TYPE.NONE) {
      canvasInfo.targetStartMouse = [mouseX, mouseY];
      canvasInfo.targetItem = canvasInfo.hitCanvasEdge;
    }
    if (canvasInfo.hitItems.length > 0) {
      canvasInfo.targetStartMouse = [mouseX, mouseY];
      canvasInfo.targetItem = canvasInfo.hitItems[0];
      globalData.focusItem = canvasInfo.hitItems[0];
    }
  }
  if (type === 'mouseup') {
    if (canvasInfo.hitItems.length === 0) {
      canvasInfo.targetStartMouse = null;
      canvasInfo.targetItem = null;
      globalData.focusItem = null;
    }
  }
  if (type === 'mousemove') {
    canvasInfo.hitCanvasEdge = hitTestCanvasEdge(mouseItem);

    const canvas = document.querySelector("#main-canvas");
    const canvasImageWidth = globalData.image.width * offset;
    const canvasImageHeight = globalData.image.height * offset;
    const canvasBaseX = canvas.width / 2 - canvasImageWidth / 2;
    const canvasBaseY = canvas.height / 2 - canvasImageHeight / 2;

    canvasInfo.hitItems = globalData.itemBoxList.filter((itemBox) => {
      const hitBox = {
        x: canvasBaseX + itemBox.x * offset,
        y: canvasBaseY + itemBox.y * offset,
        w: itemBox.w * offset,
        h: itemBox.h * offset,
      }

      return hitTest(hitBox, mouseItem) !== HIT_TYPE.NONE;
    })
    canvasInfo.hitItems.reverse();
    canvasInfo.hitItems.sort((a, b) => b.zIndex - a.zIndex);

    globalData.hoverItem = null;
    if (canvasInfo.hitItems.length > 0) {
      globalData.hoverItem = canvasInfo.hitItems[0];
    }

    if (canvasInfo.targetItem) {
      mouseMoveAction({ mouseX, mouseY });
    }
  }
}

function mouseMoveAction({ mouseX, mouseY }) {
  if (Boolean(canvasInfo.targetItem) === false) return;

  const [startX, startY] = canvasInfo.targetStartMouse;
  let distX = Math.floor(mouseX - startX);
  let distY = Math.floor(mouseY - startY);
  canvasInfo.targetStartMouse = [mouseX, mouseY];

  // resize canvas size (handle canvas edge)
  if (typeof canvasInfo.targetItem === 'string' &&
    canvasInfo.targetItem !== HIT_EDGE_TYPE.NONE &&
    canvasInfo.targetItem in HIT_EDGE_TYPE
  ) {
    // 가운데 정렬 + 양쪽으로 늘어나기 때문에, 마우스 움직인 거리의 2배만큼 늘려줘야지만 마우스 움직인 거리만큼 늘어난 것으로 보임
    distX *= 2;
    distY *= 2;
    let canvasWidth = globalData.image.width;
    let canvasHeight = globalData.image.height;

    if (canvasInfo.targetItem.startsWith(HIT_EDGE_TYPE.LEFT)) {
      canvasWidth -= distX;
    }

    if (canvasInfo.targetItem.startsWith(HIT_EDGE_TYPE.RIGHT)) {
      canvasWidth += distX;
    }

    if (canvasInfo.targetItem.endsWith(HIT_EDGE_TYPE.TOP)) {
      canvasHeight -= distY;
    }

    if (canvasInfo.targetItem.endsWith(HIT_EDGE_TYPE.BOTTOM)) {
      canvasHeight += distY;
    }

    if (canvasWidth >= 50 && canvasWidth !== globalData.image.width) {
      globalData.image.width = canvasWidth;

      const imageSizeWidth = document.querySelector("#image-size-width");
      imageSizeWidth.value = globalData.image.width;
    }

    if (canvasHeight >= 50 && canvasHeight !== globalData.image.height) {
      globalData.image.height = canvasHeight;

      const imageSizeHeight = document.querySelector("#image-size-height");
      imageSizeHeight.value = globalData.image.height;
    }
  }

  // move item
  if (canvasInfo.targetItem instanceof Item) {
    // TODO: 아이템 마우스 이동
  }
}

function getCanvasEdge() {
  const canvas = document.querySelector("#main-canvas");

  const offset = window.devicePixelRatio || 1;
  const canvasImageWidth = globalData.image.width * offset;
  const canvasImageHeight = globalData.image.height * offset;
  const canvasItem = {
    x: canvas.width / 2 - canvasImageWidth / 2,
    y: canvas.height / 2 - canvasImageHeight / 2,
    w: canvasImageWidth,
    h: canvasImageHeight,
  };

  const c_left = canvasItem.x;
  const c_right = canvasItem.x + canvasItem.w;
  const c_top = canvasItem.y;
  const c_bottom = canvasItem.y + canvasItem.h;
  const c_width = canvasItem.w;
  const c_height = canvasItem.h;
  const c_edge_size = canvasInfo.canvasEdgeSize * offset;

  const c_edge_left = {
    x: c_left - c_edge_size,
    y: c_top,
    w: c_edge_size,
    h: c_height,
  }
  const c_edge_right = {
    x: c_right,
    y: c_top,
    w: c_edge_size,
    h: c_height,
  }
  const c_edge_top = {
    x: c_left,
    y: c_top - c_edge_size,
    w: c_width,
    h: c_edge_size,
  }
  const c_edge_bottom = {
    x: c_left,
    y: c_bottom,
    w: c_width,
    h: c_edge_size,
  }
  const c_edge_left_top = {
    x: c_left - c_edge_size,
    y: c_top - c_edge_size,
    w: c_edge_size,
    h: c_edge_size,
  };
  const c_edge_left_bottom = {
    x: c_left - c_edge_size,
    y: c_bottom,
    w: c_edge_size,
    h: c_edge_size,
  };
  const c_edge_right_top = {
    x: c_right,
    y: c_top - c_edge_size,
    w: c_edge_size,
    h: c_edge_size,
  };
  const c_edge_right_bottom = {
    x: c_right,
    y: c_bottom,
    w: c_edge_size,
    h: c_edge_size,
  };

  return {
    c_edge_left,
    c_edge_right,
    c_edge_top,
    c_edge_bottom,
    c_edge_left_top,
    c_edge_left_bottom,
    c_edge_right_top,
    c_edge_right_bottom,
  }
}

function hitTestCanvasEdge(mouseItem) {
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

  const IS_HIT_LEFT = hitTest(c_edge_left, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_RIGHT = hitTest(c_edge_right, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_TOP = hitTest(c_edge_top, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_BOTTOM = hitTest(c_edge_bottom, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_LEFT_TOP = hitTest(c_edge_left_top, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_LEFT_BOTTOM = hitTest(c_edge_left_bottom, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_RIGHT_TOP = hitTest(c_edge_right_top, mouseItem) !== HIT_TYPE.NONE;
  const IS_HIT_RIGHT_BOTTOM = hitTest(c_edge_right_bottom, mouseItem) !== HIT_TYPE.NONE;

  if (IS_HIT_LEFT) return HIT_EDGE_TYPE.LEFT;
  if (IS_HIT_RIGHT) return HIT_EDGE_TYPE.RIGHT;
  if (IS_HIT_TOP) return HIT_EDGE_TYPE.TOP;
  if (IS_HIT_BOTTOM) return HIT_EDGE_TYPE.BOTTOM;
  if (IS_HIT_LEFT_TOP) return HIT_EDGE_TYPE.LEFT_TOP;
  if (IS_HIT_LEFT_BOTTOM) return HIT_EDGE_TYPE.LEFT_BOTTOM;
  if (IS_HIT_RIGHT_TOP) return HIT_EDGE_TYPE.RIGHT_TOP;
  if (IS_HIT_RIGHT_BOTTOM) return HIT_EDGE_TYPE.RIGHT_BOTTOM;

  return HIT_EDGE_TYPE.NONE;
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