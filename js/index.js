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
    const width = event.target.valueAsNumber;
    globalData.image.width = width;
  });

  // connect image size width
  const imageSizeHeight = document.querySelector("#image-size-height");
  imageSizeHeight.value = globalData.image.height;
  imageSizeHeight.addEventListener("change", (event) => {
    const height = event.target.valueAsNumber;
    globalData.image.height = height;
  });

  // canvas resize - event listener
  window.addEventListener("resize", () => debounce(syncCanvasSize)); // canvas.js

  // mouse event listener
  const canvas = document.querySelector("#main-canvas");
  canvas.addEventListener(
    'mousemove',
    (event) => debounce(onCanvasMouseEvent.bind(this, event)), // canvas.js
  );
  canvas.addEventListener('mousedown', onCanvasMouseEvent); // canvas.js
  canvas.addEventListener('mouseup', onCanvasMouseEvent); // canvas.js

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

function getItemList() {
  const itemList = [];

  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");

  const items = globalData.itemList.map((item) => {
    const itemID = item.id;
    const itemData = item.data;
    const itemType = item.type;
    const itemInfo = {
      id: itemID,
      x: itemData.x,
      y: itemData.y,
      w: 0,
      h: 0,
    }

    if (itemType === 'text') {
      // canvas text type
      context.font = `${itemData.fontSize}px sans-serif`;
      const textMetrics = context.measureText(itemData.text);

      const itemWidth = (textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft) || textMetrics.width;
      const itemHeight = (textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent) || itemData.fontSize;

      itemInfo.w = itemWidth;
      itemInfo.h = itemHeight;
    } else {
      // canvas image type [barcode, qr, image]
      // TODO: output에서 값 가져오기, output에는 getImageData 형식으로 담아보기
    }

    return itemInfo;
  })
  itemList.push(...items);

  return itemList;
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

  const filename = `barcode_${new Date().toISOString()}.png`;

  const downloadElement = document.createElement("a");
  downloadElement.download = filename;
  downloadElement.href = tempCanvas.toDataURL();
  downloadElement.click();
}

const debounceRecord = {};
function debounce(f, delay = 10) {
  if (typeof f !== 'function') return

  const timeoutID = debounceRecord[f];
  if (timeoutID) {
    clearTimeout(timeoutID);
  }

  const newTimeoutID = setTimeout(f, delay);
  debounceRecord[f] = newTimeoutID;
}
