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

  // add window resize - canvas resize event listener
  window.addEventListener("resize", syncCanvasSize);

  // add item - event listener
  const addItemButton = document.querySelector("#item-add");
  addItemButton.addEventListener("click", () => {
    openAddItemPopup(); // popup.js
  });

  // add default item set (text, barcode)
  const textData = { x: 120, y: 100, text: "barcode text", fontSize: 14 };
  const barcodeData = { x: 120, y: 30, data: "1011011001", type: "CODE128" };
  addItem("text", textData);
  addItem("barcode", barcodeData);

  // sync canvas size
  syncCanvasSize();

  // draw canvas
  drawCanvas();
});

function addItem(type, data) {
  const newItem = new Item(type, data);
  newItem.setDeleteEventListener((item) => {
    // remove element
    item.element.remove();

    // remove item in itemlist
    const $id = item.id;
    const itemIndex = globalData.itemList.findIndex((item) => item.id === $id);
    globalData.itemList.splice(itemIndex, 1);

    // reset data
    item.id = null;
    item.element = null;
    item.type = null;
    item.data = null;
  });
  globalData.itemList.push(newItem);
}

function drawCanvas() {
  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");

  const offset = devicePixelRatio || 1;
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

  const offset = devicePixelRatio || 1;

  canvas.width = wrapWidth * offset;
  canvas.height = wrapHeight * offset;
}
