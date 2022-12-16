// global data
const globalData = {
  image: {
    width: 300,
    height: 150,
    color: '#ffffff',
  },
  itemList: [],
  itemBoxList: [],
  hoverItem: null,
  focusItem: null,
};

window.addEventListener("DOMContentLoaded", () => {
  // observe hoverItem, focusItem
  let hoverItem = null;
  let focusItem = null;
  Object.defineProperties(globalData, {
    hoverItem: {
      get() {
        return hoverItem;
      },
      set(value) {
        hoverItem = value;
        resetItemHoverFocus();
        return true;
      }
    },
    focusItem: {
      get() {
        return focusItem;
      },
      set(value) {
        focusItem = value;
        resetItemHoverFocus();
        return true;
      }
    }
  });
  
  // connect image size width
  const imageSizeWidth = document.querySelector("#image-size-width");
  imageSizeWidth.value = globalData.image.width;
  imageSizeWidth.addEventListener("change", (event) => {
    const width = event.target.valueAsNumber;
    globalData.image.width = width;
  });

  // connect image size height
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
  const textData = { x: 150, y: 120, text: "example text", fontSize: 28, color: '#000000' };
  const barcodeData = { x: 150, y: 50, data: "1011011001", type: "CODE128", color: '#000000' };
  addItem(ItemType.TEXT, textData);
  addItem(ItemType.BARCODE, barcodeData);

  // draw canvas
  drawCanvas(); // canvas.js
});

function addItem(type, data) {
  const newItem = new Item(type, data);
  newItem.setChangeEventListener((item) => {
    const $id = item.id;
    const findIndex = globalData.itemBoxList.findIndex((item) => item.id === $id);

    const itemBox = getItemBox(item);
    globalData.itemBoxList.splice(findIndex, 1, itemBox);
  });
  newItem.setStateChangeEventListener((item, state, value) => {
    if (state === ItemState.HOVER) {
      globalData.hoverItem = value ? item : null;
    }
    if (state === ItemState.FOCUS) {
      globalData.focusItem = value ? item : null;
    }
  })
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
  globalData.itemList.sort((a, b) => a.zIndex - b.zIndex);
  getItemList();

}

function getItemList() {
  const itemList = globalData.itemList.map(getItemBox);
  globalData.itemBoxList = itemList;
}

function getItemBox(item) {
  const canvas = document.querySelector("#main-canvas");
  const context = canvas.getContext("2d");

  const itemID = item.id;
  const itemData = item.data;
  const itemType = item.type;
  const itemBox = {
    id: itemID,
    item: item,
    x: itemData.x,
    y: itemData.y,
    w: 0,
    h: 0,
  }

  if (itemType === ItemType.TEXT) {
    // canvas text type
    context.font = `${itemData.fontSize}px sans-serif`;
    const textMetrics = context.measureText(itemData.text);

    const itemWidth = (textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft) || textMetrics.width;
    const itemHeight = (textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent) || itemData.fontSize;

    itemBox.x -= itemWidth / 2;
    itemBox.y -= itemHeight / 2;
    itemBox.w = itemWidth;
    itemBox.h = itemHeight;
  } else {
    itemBox.x -= itemData.width / 2;
    itemBox.y -= itemData.height / 2;
    itemBox.w = itemData.width;
    itemBox.h = itemData.height;
  }

  return itemBox;
}

function resetItemHoverFocus() {
  const hoverId = globalData.hoverItem?.id;
  const focusId = globalData.focusItem?.id;

  globalData.itemList.forEach((item) => {
    const element = item.element;
    const classList = element.classList;
    classList.remove('hover');
    classList.remove('focus');

    if (item.id === hoverId) {
      classList.add('hover');
      element.scrollIntoView();
    }
    if (item.id === focusId) {
      classList.add('focus');
      element.scrollIntoView();
    }
  })
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

function delayTime(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}
