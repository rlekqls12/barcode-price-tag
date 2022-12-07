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
