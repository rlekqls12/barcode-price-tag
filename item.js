/**
 * @typedef {'text' | 'barcode' | 'qr' | 'image'} ItemType
 */

const initItemType = "text";
const initItemData = {
  text: { x: 0, y: 0, text: "", fontSize: 14 },
  barcode: { x: 0, y: 0, data: "", type: "CODE128" },
  qr: { x: 0, y: 0, data: "" },
  image: { x: 0, y: 0, width: 100, height: 100, data: "", type: "src", imageData: null }, // type: src, blob
};

class Item {
  id = null; // random
  element = null; // dom element
  type = null; // text, barcode, qr
  data = null; // item data
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
    const availableTypes = ["text", "barcode", "qr", "image"];
    if (availableTypes.includes(type) === false) {
      throw new Error(`${type} is not includes [${availableTypes.join(", ")}]`);
    }

    // set id
    this.id = Math.random().toString(16).slice(2).toUpperCase();

    // set type
    this.type = type;

    // set data
    this.data = data;

    // clone item element
    const originalItem = document.querySelector('div[data-id="item"]');
    this.element = originalItem.cloneNode(true);
    this.element.setAttribute("data-id", `item#${this.id}`);
    this.element.classList.add(`item-type-${type}`);

    // init data element
    this.initDataElement();

    // append item
    const itemListDOM = document.querySelector("#item-list");
    itemListDOM.appendChild(this.element);

    // init event listener
    this.initEventListener();
  }

  setDeleteEventListener(callback) {
    this.deleteListener = callback;
  }

  initEventListener() {
    // ------------------------- click event
    this.element.addEventListener("click", (event) => {
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
      }
    });

    // ------------------------- change event
    this.element.addEventListener("change", (event) => {
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
        if (this.type === "text") {
          this.data.text = value;
        }
        if (this.type === "barcode") {
          this.data.data = value;
        }
        if (this.type === "qr") {
          this.data.data = value;
        }
        if (this.type === "image") {
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
        if (this.type === "image") {
          this.data.width = value;
        }
      }

      // height
      if (dataID === "item-input-height") {
        if (this.type === "image") {
          this.data.height = value;
        }
      }

      // font size
      if (dataID === "item-input-font-size") {
        if (this.type === "text") {
          this.data.fontSize = number;
        }
      }

      // barcode type
      if (dataID === "item-select-barcode-type") {
        if (this.type === "barcode") {
          this.data.type = value;
        }
      }

      // image type
      if (dataID === "item-select-image-type") {
        if (this.type === "image") {
          this.data.type = value;
          this.data.data = "";

          const imageDataElement = this.element.querySelector('input[data-id="item-input-data"]')
          if (value === 'src') {
            imageDataElement.type = 'text';
          } else if (value === 'blob') {
            imageDataElement.type = 'file';
          }
        }
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
        if ($type === "text") {
          // type text
          getElement("span", "item-type-text").textContent = `Text`;

          // data text
          getElement("input", "item-input-data").value = $data.text;

          // font size
          getElement("input", "item-input-font-size").value = $data.fontSize;

          // remove other type element
          getElement("div", "item-layout-width").remove();
          getElement("div", "item-layout-height").remove();
          getElement("div", "item-layout-barcode-type").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  barcode type
        if ($type === "barcode") {
          // type text
          getElement("span", "item-type-text").textContent = `Barcode`;

          // data text
          getElement("input", "item-input-data").value = $data.data;

          // barcode type
          getElement("select", "item-select-barcode-type").value = $data.type;

          // remove other type element
          getElement("div", "item-layout-width").remove();
          getElement("div", "item-layout-height").remove();
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  qr type
        if ($type === "qr") {
          // type text
          getElement("span", "item-type-text").textContent = `QR`;

          // data text
          getElement("input", "item-input-data").value = $data.data;

          // remove other type element
          getElement("div", "item-layout-width").remove();
          getElement("div", "item-layout-height").remove();
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-barcode-type").remove();
          getElement("div", "item-layout-image-type").remove();
        }

        // -------------------------  image type
        if ($type === "image") {
          // type text
          getElement("span", "item-type-text").textContent = `Image`;

          // data text
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
          getElement("div", "item-layout-font-size").remove();
          getElement("div", "item-layout-barcode-type").remove();
        }


        // remove event
        itemListDOM.removeEventListener("DOMNodeInserted", eventFunction);
      }
    );
  }
}
