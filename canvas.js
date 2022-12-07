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
  
  function checkMouseEvent(event) {
    const { offsetX: mouseX, offsetY: mouseY, type } = event;
    console.log(type, mouseX, mouseY);

    const itemList = getItemList(); // index.js

    // TODO: 충돌검사 (캔버스 배경 먼저 로직 짜기)
    // 마우스 주변에 다른 아이템 없고 캔버스만 있는 경우
    // 1. 캔버스 크기 조절 그림 표시
    // 2. 마우스 모양 변경
  }
