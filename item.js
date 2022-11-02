const initType = "text";
const initData = {
  text: { x: 0, y: 0, text: "", fontSize: 14 },
  barcode: { x: 0, y: 0, data: "", type: "" },
  qr: { x: 0, y: 0, data: "" },
};

class Item {
  id = null; // random
  element = null; // dom element
  type = null; // text, barcode, qr
  data = null; // item data

  constructor(type, data) {
    // default type and data
    if (Boolean(type) === false) {
      type = initType;
    }
    if (Boolean(data) === false) {
      data = initData[type];
    }

    // type available check
    const availableTypes = ["text", "barcode", "qr"];
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

  delete() {
    // remove element
    this.element.remove();

    // remove item in itemlist
    const $id = this.id;
    const itemIndex = globalData.itemList.findIndex((item) => item.id === $id);
    globalData.itemList.splice(itemIndex, 1);

    // reset value
    this.id = null;
    this.element = null;
    this.type = null;
    this.data = null;
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
        this.delete();
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
      }

      // x
      if (dataID === "item-input-x") {
        this.data.x = number;
      }

      // y
      if (dataID === "item-input-y") {
        this.data.y = number;
      }

      // font size
      if (dataID === "item-input-font-size") {
        this.data.fontSize = number;
      }

      // barcode-type
      if (dataID === "item-select-barcode-type") {
        this.data.type = value;
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

        // data x
        getElement("input", "item-input-x").value = $data.x;

        // data y
        getElement("input", "item-input-y").value = $data.y;

        // -------------------------  text type
        if ($type === "text") {
          // type text
          getElement("span", "item-type-text").textContent = `Text#${$id}`;

          // data text
          getElement("input", "item-input-data").value = $data.text;

          // font size
          getElement("input", "item-input-font-size").value = $data.fontSize;

          // remove other type element
          getElement("div", "item-layout-barcode-type").remove();
        }

        // -------------------------  barcode type
        if ($type === "barcode") {
          // type text
          getElement("span", "item-type-text").textContent = `Barcode#${$id}`;

          // data text
          getElement("input", "item-input-data").value = $data.data;

          // barcode type
          getElement("select", "item-select-barcode-type").value = $data.type;

          // remove other type element
          getElement("div", "item-layout-font-size").remove();
        }

        // -------------------------  qr type
        if ($type === "qr") {
          // type text
          getElement("span", "item-type-text").textContent = `QR#${$id}`;

          // data text
          getElement("input", "item-input-data").value = $data.data;

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
