const ITEM_TYPE = {
  TEXT: 'text',
  BARCODE: 'barcode',
  QR: 'qr',
  IMAGE: 'image',
}

const ITEM_STATE = {
  FOCUS: 'focus',
  HOVER: 'hover',
}

const initItemType = ITEM_TYPE.TEXT;
const initItemData = {
  [ITEM_TYPE.TEXT]: { x: 0, y: 0, text: "", fontSize: 14, color: '#000000' },
  [ITEM_TYPE.BARCODE]: { x: 0, y: 0, width: 200, height: 80, data: "", type: "CODE128", color: '#000000', output: null },
  [ITEM_TYPE.QR]: { x: 0, y: 0, width: 100, height: 100, data: "", color: '#000000', output: null },
  [ITEM_TYPE.IMAGE]: { x: 0, y: 0, width: 100, height: 100, data: "", type: "src", output: null }, // type: src, blob
};

class Item {
  id = null; // random
  element = null; // dom element
  type = null; // text, barcode, qr
  data = null; // item data
  zIndex = 0; // item depth
  changeListener = null; // execute when change
  stateChangeListener = null; // execute when state change
  deleteListener = null; // execute when delete

  constructor(type, data) {
    // default type and data
    if (Boolean(type) === false) {
      type = initItemType;
    }
    if (Boolean(data) === false) {
      data = initItemData[type];
    }

    // type available check
    const availableTypes = Object.keys(ITEM_TYPE).map((t) => t.toLowerCase());
    if (availableTypes.includes(type) === false) {
      throw new Error(`${type} is not includes [${availableTypes.join(", ")}]`);
    }

    // set id
    this.id = Math.random().toString(16).slice(2).toUpperCase();

    // set type
    this.type = type;

    // set data
    this.data = {
      ...initItemData[type],
      ...data,
    };

    // clone item element
    const originalItem = document.querySelector('div[data-id="item"]');
    this.element = originalItem.cloneNode(true);
    this.element.setAttribute("data-id", `item#${this.id}`);
    this.element.classList.add(`item-type-${type}`);
    this.element.classList.remove('hidden');

    // init data element
    this.initDataElement();

    // append item
    const itemListDOM = document.querySelector("#item-list");
    itemListDOM.appendChild(this.element);

    // init event listener
    this.initEventListener();
  }

  setChangeEventListener(callback) {
    this.changeListener = callback;
  }

  setStateChangeEventListener(callback) {
    this.stateChangeListener = callback;
  }

  setDeleteEventListener(callback) {
    this.deleteListener = callback;
  }

  initEventListener() {
    // ------------------------- hover event
    this.element.addEventListener("mouseenter", () => {
      if (this.id === null) return;

      if (typeof this.stateChangeListener === 'function') {
        this.stateChangeListener(this, ITEM_STATE.HOVER, true);
      }
    });

    // ------------------------- hover out event
    this.element.addEventListener("mouseleave", () => {
      if (this.id === null) return;

      if (typeof this.stateChangeListener === 'function') {
        this.stateChangeListener(this, ITEM_STATE.HOVER, false);
      }
    });

    // ------------------------- click event
    this.element.addEventListener("click", (event) => {
      if (this.id === null) return;
      
      // get item dom
      const currentItemDOM = event.currentTarget;
      // get clicked dom data-id
      const clickedDOM = event.target;
      let targetDOM = clickedDOM;
      let dataID = targetDOM.getAttribute("data-id");
      if (dataID === null) {
        targetDOM = clickedDOM.parentNode;
        dataID = targetDOM.getAttribute("data-id");
      }

      // layout toggle
      if (dataID === "event-layout-toggle") {
        // toggle visible event layout
        const itemControlLayout = currentItemDOM.querySelector(
          ".item-layout-control"
        );
        itemControlLayout.classList.toggle("hide");

        // toggle text
        const span = targetDOM.querySelector("span");
        span.textContent = span.textContent === "▼" ? "▲" : "▼";
      }

      // delete
      if (dataID === "event-delete") {
        if (typeof this.deleteListener !== 'function') return;
        this.deleteListener(this);
        return;
      }
      
      // focus
      if (typeof this.stateChangeListener === 'function') {
        this.stateChangeListener(this, ITEM_STATE.FOCUS, true);
      }
    });

    // ------------------------- change event
    this.element.addEventListener("change", (event) => {
      if (this.id === null) return;
      
      // get item dom
      const currentItemDOM = event.currentTarget;
      // get changed dom data-id
      const changedDOM = event.target;
      let targetDOM = changedDOM;
      let dataID = targetDOM.getAttribute("data-id");
      if (dataID === null) {
        targetDOM = changedDOM.parentNode;
        dataID = targetDOM.getAttribute("data-id");
      }

      const value = targetDOM.value;
      const number = targetDOM?.valueAsNumber;

      // data
      if (dataID === "item-input-data") {
        if (this.type === ITEM_TYPE.TEXT) {
          this.data.text = value;
        }
        if (this.type === ITEM_TYPE.BARCODE) {
          this.data.data = value;
        }
        if (this.type === ITEM_TYPE.QR) {
          this.data.data = value;
        }
        if (this.type === ITEM_TYPE.IMAGE) {
          if (this.data.type === 'src') {
            this.data.data = value;
          } else if (this.data.type === 'blob') {
            this.data.data = targetDOM.files?.[0];
          }
        }
      }

      // x
      if (dataID === "item-input-x") {
        this.data.x = number;
      }

      // y
      if (dataID === "item-input-y") {
        this.data.y = number;
      }

      // width
      if (dataID === "item-input-width") {
        this.data.width = number;
        this.data.output = null;
      }

      // height
      if (dataID === "item-input-height") {
        this.data.height = number;
        this.data.output = null;
      }

      // color
      if (dataID === "item-input-color") {
        this.data.color = value;
        this.data.output = null;
      }

      // font size
      if (dataID === "item-input-font-size") {
        this.data.fontSize = number;
      }

      // barcode type
      if (dataID === "item-select-barcode-type") {
        this.data.type = value;
        this.data.output = null;
      }

      // image type
      if (dataID === "item-select-image-type") {
        this.data.type = value;
        this.data.data = "";
        this.data.output = null;

        const imageDataElement = this.element.querySelector('input[data-id="item-input-data"]')
        if (value === 'src') {
          imageDataElement.type = 'text';
        } else if (value === 'blob') {
          imageDataElement.type = 'file';
        }
      }

      if (typeof this.changeListener === 'function') {
        this.changeListener(this);
      }
    });
  }

  initDataElement() {
    const $id = this.id.slice(0, 4);
    const $type = this.type;
    const $element = this.element;
    const $data = this.data;

    // get item child element function
    const getElement = (tag, dataId) =>
      $element.querySelector(`${tag}[data-id="${dataId}"]`);

    // item inserted event
    const itemListDOM = document.querySelector("#item-list");
    itemListDOM.addEventListener(
      "DOMNodeInserted",
      function eventFunction(event) {
        // check my event
        if (event.target !== $element) return;

        // id
        getElement("span", "item-id-text").textContent = `#${$id}`;

        // data x
        getElement("input", "item-input-x").value = $data.x;

        // data y
        getElement("input", "item-input-y").value = $data.y;

        // -------------------------  text type
        if ($type === ITEM_TYPE.TEXT) {
          // type
          getElement("span", "item-type-text").textContent = `Text`;

          // data
          getElement("input", "item-input-data").value = $data.text;

          // color
          getElement("input", "item-input-color").value = $data.color;

          // font size
          getElement("input", "item-input-font-size").value = $data.fontSize;

          // remove other type element
          getElement("div", "item-layout-width").remove();
          getElement("div", "item-layout-height").remove();
          getElement("div", "item-layout-barcode-type").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  barcode type
        if ($type === ITEM_TYPE.BARCODE) {
          // type
          getElement("span", "item-type-text").textContent = `Barcode`;

          // data
          getElement("input", "item-input-data").value = $data.data;

          // color
          getElement("input", "item-input-color").value = $data.color;

          // barcode type
          getElement("select", "item-select-barcode-type").value = $data.type;

          // width
          getElement("input", "item-input-width").value = $data.width;

          // height
          getElement("input", "item-input-height").value = $data.height;

          // remove other type element
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  qr type
        if ($type === ITEM_TYPE.QR) {
          // type
          getElement("span", "item-type-text").textContent = `QR`;

          // data
          getElement("input", "item-input-data").value = $data.data;

          // color
          getElement("input", "item-input-color").value = $data.color;

          // width
          getElement("input", "item-input-width").value = $data.width;

          // height
          getElement("input", "item-input-height").value = $data.height;

          // remove other type element
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-barcode-type").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  image type
        if ($type === ITEM_TYPE.IMAGE) {
          // type
          getElement("span", "item-type-text").textContent = `Image`;

          // data
          if ($data.type === 'src') {
            getElement("input", "item-input-data").type = 'text';
            getElement("input", "item-input-data").value = $data.data;
          } else if ($data.type === 'blob') {
            getElement("input", "item-input-data").type = 'file';
            getElement("input", "item-input-data").value = "";
          }

          // width
          getElement("input", "item-input-width").value = $data.width;

          // height
          getElement("input", "item-input-height").value = $data.height;

          // image type
          getElement("select", "item-select-image-type").value = $data.type;

          // remove other type element
          getElement("div", "item-layout-color").remove();
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-barcode-type").remove();
        }


        // remove event
        itemListDOM.removeEventListener("DOMNodeInserted", eventFunction);
      }
    );
  }

  async draw(context, base, box, state) {
    if (this.id === null) return;
    
    const offset = window.devicePixelRatio || 1;
    const itemID = this.id;
    const itemType = this.type;
    const itemData = this.data;

    if (itemType === ITEM_TYPE.TEXT) {
      const baseX = base.x + itemData.x * offset;
      const baseY = base.y + itemData.y * offset;

      context.fillStyle = itemData.color;
      context.font = `${itemData.fontSize * offset}px sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.fillText(itemData.text, baseX, baseY);

      if (state.hover || state.focus) {
        context.lineWidth = 3;

        if (state.hover) context.strokeStyle = 'skyblue';
        if (state.focus) context.strokeStyle = 'deepskyblue';

        const itemWidth = box.w * offset;
        const itemHeight = box.h * offset;

        const borderMargin = 3 * offset;
        const borderX = baseX - itemWidth / 2 - borderMargin;
        const borderY = baseY - itemHeight / 2 - borderMargin;
        const borderW = itemWidth + borderMargin * 2;
        const borderH = itemHeight + borderMargin * 2;
        context.strokeRect(borderX, borderY, borderW, borderH);
      }
    } else if (itemType === ITEM_TYPE.BARCODE) {
      if (Boolean(itemData.output)) {
        const isChangedWidth = itemData.width * offset !== itemData.output.width;
        const isChangedHeight = itemData.height * offset !== itemData.output.height;
        if (isChangedWidth || isChangedHeight) {
          itemData.output = null;
        }
      }

      if (Boolean(itemData.output) === false && itemData.data) {
        if (itemData.width === 0 || itemData.height === 0) return;

        const domID = `barcode${itemID}`
        const findMyCanvas = document.querySelector(`#${domID}`);
        if (findMyCanvas) return;
      
        const itemWidth = itemData.width * offset; 
        const itemHeight = itemData.height * offset;

        const tempCanvas = document.createElement('canvas');
        Object.assign(tempCanvas, {
          id: domID,
          width: itemWidth,
          height: itemHeight,
          style: {
            width: `${itemData.width}px`,
            height: `${itemData.height}px`,
            display: 'none',
            backgroundColor: 'transparent',
          }
        })

        try {
          const tempData = {};
          JsBarcode(tempData, itemData.data, { format: itemData.type });
          const barcodeData = tempData.encodings?.[0].data?.split('');
          const barcodeSize = itemWidth / barcodeData.length;

          const tempContext = tempCanvas.getContext('2d');
          tempContext.clearRect(0, 0, itemData.width, itemData.height);
          tempContext.fillStyle = itemData.color;
          barcodeData.forEach((fill, index) => {
            if (fill === '0') return;
            tempContext.fillRect(index * barcodeSize, 0, barcodeSize, itemHeight);
          })
  
          const output = tempContext.getImageData(0, 0, itemWidth, itemHeight);
          itemData.output = output;
        } finally {
          tempCanvas.remove();
        }
      }

      if (itemData.output) {
        const baseX = base.x + itemData.x * offset - box.w / 2 * offset;
        const baseY = base.y + itemData.y * offset - box.h / 2 * offset;
      
        const itemWidth = itemData.width * offset;
        const itemHeight = itemData.height * offset;

        const backgroundImageData = context.getImageData(baseX, baseY, itemWidth, itemHeight);
        const itemImageData = itemData.output.data;
        
        for (let i = 0, len = itemImageData.length / 4; i < len; i++) {
          const baseIndex = i * 4;
          const alpha = itemImageData[baseIndex + 3];
          if (alpha !== 0) {
            const red = itemImageData[baseIndex + 0];
            const green = itemImageData[baseIndex + 1];
            const blue = itemImageData[baseIndex + 2];

            backgroundImageData.data[baseIndex + 0] = red;
            backgroundImageData.data[baseIndex + 1] = green;
            backgroundImageData.data[baseIndex + 2] = blue;
            backgroundImageData.data[baseIndex + 3] = alpha;
          }
        }

        context.putImageData(backgroundImageData, baseX, baseY);

        if (state.hover || state.focus) {
          context.lineWidth = 3;
  
          if (state.hover) context.strokeStyle = 'skyblue';
          if (state.focus) context.strokeStyle = 'deepskyblue';
  
          const borderMargin = 3 * offset;
          const borderX = baseX - borderMargin;
          const borderY = baseY - borderMargin;
          const borderW = itemWidth + borderMargin * 2;
          const borderH = itemHeight + borderMargin * 2;
          context.strokeRect(borderX, borderY, borderW, borderH);
        }
      }
    } else if (itemType === ITEM_TYPE.QR) {
      context.fillStyle = itemData.color;
      // TODO:
    } else if (itemType === ITEM_TYPE.IMAGE) {
      // TODO:
    }
  }
}
