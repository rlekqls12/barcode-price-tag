// global data
const globalData = {
  image: {
    width: 300,
    height: 150,
  },
  itemList: [],
};

window.addEventListener("DOMContentLoaded", () => {
  // connect image size width
  const imageSizeWidth = document.querySelector("#image-size-width");
  imageSizeWidth.value = globalData.image.width;
  imageSizeWidth.addEventListener("change", (event) => {
    const width = event.target.value;
    globalData.image.width = width;
    syncCanvasSize();
  });

  // connect image size width
  const imageSizeHeight = document.querySelector("#image-size-height");
  imageSizeHeight.value = globalData.image.height;
  imageSizeHeight.addEventListener("change", (event) => {
    const height = event.target.value;
    globalData.image.height = height;
    syncCanvasSize();
  });

  // sync canvas size
  syncCanvasSize();

  // add item - event listener
  const addItemButton = document.querySelector("#item-add");
  addItemButton.addEventListener("click", () => {
    openAddItemPopup(); // popup.js
  });

  // draw canvas
  drawCanvas();
});

function drawCanvas() {
  syncCanvasSize();
  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");

  const offset = devicePixelRatio || 1;
  const image = globalData.image;
  context.clearRect(0, 0, image.width * offset, image.height * offset);

  // draw items

  requestAnimationFrame(drawCanvas);
}

function syncCanvasSize() {
  const canvas = document.querySelector("#main-canvas");
  const offset = devicePixelRatio || 1;

  canvas.width = globalData.image.width * offset;
  canvas.height = globalData.image.height * offset;

  canvas.style.width = `${globalData.image.width}px`;
  canvas.style.height = `${globalData.image.height}px`;
}
