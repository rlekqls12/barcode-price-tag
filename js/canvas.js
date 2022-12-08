function drawCanvas() {
    const canvas = document.querySelector("#main-canvas");
    const context = canvas.getContext("2d");
  
    const offset = window.devicePixelRatio || 1;
    const image = globalData.image;
    context.clearRect(0, 0, image.width * offset, image.height * offset);
  
    // draw canvas layout rect
    context.fillStyle = "white";
    context.fillRect(
      canvas.width / 2 - globalData.image.width / 2,
      canvas.height / 2 - globalData.image.height / 2,
      globalData.image.width,
      globalData.image.height
    );
  
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
  
  function onCanvasMouseEvent(event) {
    const { offsetX: mouseX, offsetY: mouseY, type } = event;
    console.log(type, mouseX, mouseY);

    const itemList = getItemList(); // index.js

    const hitItems = [];

    // TODO: 아이템 충돌 검사 로직...

    const hitCanvasInfo = hitTestCanvasEdge();
    if (hitCanvasInfo) {
      // 마우스 주변에 다른 아이템 없고 캔버스만 있는 경우 (삼각함수로 계산하기)
      // 1. 캔버스 크기 조절 그림 표시
      // 2. 마우스 모양 변경
    }
  }

  function hitTestCanvasEdge() {
    const canvas = document.querySelector("#main-canvas");
    const canvasItem = {
      x: canvas.width / 2 - globalData.image.width / 2,
      y: canvas.height / 2 - globalData.image.height / 2,
      w: globalData.image.width,
      h: globalData.image.height,
    };

    // 상하좌우, 좌상, 좌하, 우상, 우하 계산해서 return 하기

    return null;
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
    const condition4 = o_row_some_t && o_row_some_t;
    if (condition1 || condition2 || condition3 || condition4) {
      return HIT_TYPE.HIT;
    }

    return HIT_TYPE.NONE;
  }
