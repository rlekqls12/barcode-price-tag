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
  
    requestAnimationFrame(drawCanvas);
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
  