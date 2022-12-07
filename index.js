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
    syncCanvasSize(); // canvas.js
  });

  // connect image size width
  const imageSizeHeight = document.querySelector("#image-size-height");
  imageSizeHeight.value = globalData.image.height;
  imageSizeHeight.addEventListener("change", (event) => {
    const height = event.target.value;
    globalData.image.height = height;
    syncCanvasSize(); // canvas.js
  });

  // canvas resize - event listener
  window.addEventListener("resize", syncCanvasSize); // canvas.js

  // mouse event listener
  const canvas = document.querySelector("#main-canvas");
  canvas.addEventListener('mousemove', checkMouseEvent); // canvas.js
  canvas.addEventListener('mousedown', checkMouseEvent); // canvas.js
  canvas.addEventListener('mouseup', checkMouseEvent); // canvas.js

  // save image - event listener
  const saveImageButton = document.querySelector("#image-save-btn");
  saveImageButton.addEventListener("click", saveIamge);

  // add item - event listener
  const addItemButton = document.querySelector("#item-add");
  addItemButton.addEventListener("click", openAddItemPopup); // popup.js

  // add default item set (text, barcode)
  const textData = { x: 120, y: 100, text: "barcode text", fontSize: 14 };
  const barcodeData = { x: 120, y: 30, data: "1011011001", type: "CODE128" };
  addItem("text", textData);
  addItem("barcode", barcodeData);

  // sync canvas size
  syncCanvasSize(); // canvas.js

  // draw canvas
  drawCanvas(); // canvas.js
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

function saveIamge() {
  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");
  const cropImageData = context.getImageData(
    canvas.width / 2 - globalData.image.width / 2,
    canvas.height / 2 - globalData.image.height / 2,
    globalData.image.width,
    globalData.image.height
  );

  const offset = window.devicePixelRatio || 1;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = globalData.image.width * offset;
  tempCanvas.height = globalData.image.height * offset;

  const tempContext = tempCanvas.getContext("2d");
  tempContext.putImageData(cropImageData, 0, 0);

  const downloadElement = document.createElement("a");
  downloadElement.download = true;
  downloadElement.href = tempCanvas.toDataURL();
  downloadElement.click();
}
